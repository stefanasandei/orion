<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Note } from '@repo/db';
	import { Textarea } from '@/components/ui/textarea';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import { Icons } from '$base/src/lib/components/icons.svelte';
	import HtmlPreview from '$base/src/lib/components/html-preview.svelte';
	import DeleteNote from '$base/src/lib/components/project/delete-note.svelte';
	import { parse } from 'marked';
	import { onMount, untrack } from 'svelte';
	import { mapProxy } from '$base/src/lib/utils/map-proxy';
	import { number } from 'zod';
	import { Badge } from '$base/src/lib/components/ui/badge';

	// -------------------------------------------
	// Props and Data Setup
	// -------------------------------------------
	let {
		data: _data
	}: {
		data: {
			user: UserLocals;
			notes: (Note & { tags: { tagId: number; tag: { name: string } }[] })[];
		};
	} = $props();
	const { user, notes: _notes } = $derived(_data);
	const thoughts = $derived(_notes.filter((n) => n.type == 'thought'));

	// -------------------------------------------
	// New Thought Input State
	// -------------------------------------------
	let newThought = $state('');
	let deleteThought = $state<Note>();
	let deleteDialogOpen = $state(false);

	const addNewThought = trpc().project.createQuickNote.createMutation({
		onSuccess: async () => {
			toast.success($t('dashboard.quick_thoughts.success'));
			newThought = '';
			await invalidateAll();
		}
	});

	function handleSubmit() {
		if (!newThought.trim()) return;

		$addNewThought.mutate({
			content: newThought,
			type: 'thought'
		});
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	// -------------------------------------------
	// Markdown Rendering and Cache
	// -------------------------------------------
	let cachedHtml = $state<Map<string, string>>(new Map());

	function renderHtml(content: string) {
		if (cachedHtml.has(content)) {
			return cachedHtml.get(content)!;
		}

		const rendered = parse(content, {
			async: false
		}) as string;

		cachedHtml.set(content, rendered);

		return rendered;
	}

	// -------------------------------------------
	// Overflow Detection Logic
	// -------------------------------------------
	let containerEl = $state({ containers: mapProxy(new Map<number, HTMLElement>()) });
	let isOverflowing = $state({ containers: mapProxy(new Map<number, boolean>()) });

	const checkOverflow = () => {
		const containers = containerEl.containers;

		untrack(() => {
			let overflowing = isOverflowing.containers;

			thoughts.forEach((thought) => {
				const element = containers.get(thought.id);
				if (!element) return;

				overflowing.set(thought.id, element.scrollHeight > element.clientHeight);
			});

			isOverflowing = { containers: overflowing };
		});
	};

	// -------------------------------------------
	// Link Preview Logic
	// -------------------------------------------
	const METADATA_CACHE_KEY = 'thoughtsLinkMetadata';
	type LinkMetadata = Record<string, { title: string; description: string; image: string }>;

	const isURL = (text: string): boolean => {
		const urlRegex =
			/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
		return urlRegex.test(text);
	};

	let linkMetadata = $state<LinkMetadata>({});

	function loadMetadataFromCache(): LinkMetadata {
		try {
			const cached = localStorage.getItem(METADATA_CACHE_KEY);
			return cached ? JSON.parse(cached) : {};
		} catch (error) {
			console.error('Failed to load metadata from cache:', error);
			return {};
		}
	}

	function saveMetadataToCache(metadata: LinkMetadata) {
		try {
			localStorage.setItem(METADATA_CACHE_KEY, JSON.stringify(metadata));
		} catch (error) {
			console.error('Failed to save metadata to cache:', error);
		}
	}

	async function fetchLinkMetadata(url: string) {
		if (url in linkMetadata) return null;

		try {
			const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
			const data = await response.json();
			return {
				url,
				metadata: {
					title: data.title || url,
					description: data.description || '',
					image: data.image || ''
				}
			};
		} catch (error) {
			console.error('Failed to fetch metadata:', error);
			return {
				url,
				metadata: {
					title: url,
					description: '',
					image: ''
				}
			};
		}
	}

	async function loadAndFetchMetadata() {
		// First load from cache
		linkMetadata = loadMetadataFromCache();

		// Then fetch any missing metadata
		const urlThoughts = thoughts.filter((thought) => isURL(thought.name));
		const thoughtsNeedingMetadata = urlThoughts.filter(
			(thought) => !(thought.name in linkMetadata)
		);

		if (thoughtsNeedingMetadata.length === 0) return;

		const metadataPromises = thoughtsNeedingMetadata.map((thought) =>
			fetchLinkMetadata(thought.name)
		);
		const results = await Promise.all(metadataPromises);

		const newMetadata = { ...linkMetadata };
		results
			.filter((result) => result !== null)
			.forEach((result) => {
				newMetadata[result.url] = result.metadata;
			});

		linkMetadata = newMetadata;
		saveMetadataToCache(newMetadata);
	}

	// -------------------------------------------
	// Lifecycle Hooks
	// -------------------------------------------
	onMount(checkOverflow);
	$effect(checkOverflow);
	onMount(loadAndFetchMetadata);

	//TODO: search, tags
</script>

<DashboardShell pageName={'Thoughts'} {user}>
	<div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
		<!-- Input area -->
		<div
			class="bg-card hover:ring-ring ring-accent flex flex-col gap-4 rounded-xl p-4 shadow-sm ring-1 ring-inset transition-all hover:ring-2"
		>
			<Textarea
				bind:value={newThought}
				onkeydown={handleKeyDown}
				class="bg-card flex-1 resize-none border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
				placeholder="What's on your mind?"
				rows={3}
			/>
			<div class="flex justify-end">
				<Button onclick={handleSubmit} size="sm">Save Thought</Button>
			</div>
		</div>

		<!-- Thoughts feed -->
		<div class="flex flex-col gap-4">
			{#each thoughts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as thought}
				{#if isURL(thought.name)}
					{@render linkPreviewCard(thought)}
				{:else}
					<!-- raw text card -->
					{@render thoughtCard(thought)}
				{/if}
			{/each}
		</div>
	</div>
</DashboardShell>

<DeleteNote item={{ id: deleteThought?.id!, name: '' }} bind:open={deleteDialogOpen} />

{#snippet thoughtCard(thought: Note & { tags: { tagId: number; tag: { name: string } }[] })}
	<Card.Root class="bg-card hover:bg-muted/50 transition-colors duration-75">
		<Card.Content class="flex flex-col justify-between space-y-2 pb-2">
			<button
				bind:this={containerEl.containers[thought.id]}
				onclick={() => goto(`/thoughts/${thought.id}`)}
				class="group relative max-h-60 w-full flex-1 cursor-pointer overflow-hidden"
			>
				<div class="w-full overflow-x-auto">
					<div class="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-full">
						<HtmlPreview className="text-xl" htmlContent={renderHtml(thought.name)} />
					</div>
				</div>

				{#if isOverflowing.containers[thought.id]}
					<div
						class="from-card pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t to-transparent transition-opacity duration-300 group-hover:opacity-50"
					></div>
				{/if}
			</button>

			<div class="flex flex-row items-end justify-between">
				<div class="flex flex-row gap-2">
					<p class="text-muted-foreground text-sm">
						{new Date(thought.createdAt).toLocaleString()}
					</p>
					<div class={'flex flex-row items-center gap-1'}>
						{#each thought.tags as tag}
							<Badge variant={'secondary'}>{tag.tag.name}</Badge>
						{/each}
					</div>
				</div>

				<div class="flex flex-col justify-end gap-2">
					<Button
						onclick={() => {
							deleteThought = thought;
							deleteDialogOpen = true;
						}}
						size="icon"
						variant="outline"
					>
						<Icons.delete />
					</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet linkPreviewCard(thought: Note & { tags: { tagId: number; tag: { name: string } }[] })}
	<Card.Root class="bg-card hover:bg-muted/50 overflow-hidden transition-colors duration-75">
		<Card.Content class="flex flex-col space-y-2 p-0">
			<a
				href={thought.name}
				target="_blank"
				rel="noopener noreferrer"
				class="group grid w-full grid-cols-[1fr_auto] gap-4 p-4 sm:grid-cols-[1fr_220px]"
			>
				<div class="flex flex-col justify-between gap-2">
					<div class="space-y-1">
						<h3 class="font-semibold leading-none tracking-tight">
							{#if thought.name in linkMetadata}
								{linkMetadata[thought.name].title}
							{:else}
								{thought.name}
							{/if}
						</h3>
						{#if thought.name in linkMetadata && linkMetadata[thought.name].description}
							<p class="text-muted-foreground line-clamp-2 text-sm">
								{linkMetadata[thought.name].description}
							</p>
						{/if}
					</div>

					<div class="flex flex-row gap-2">
						<p class="text-muted-foreground flex items-center gap-2 text-xs">
							{new URL(thought.name).hostname}
						</p>

						<div class={'flex flex-row items-center gap-1'}>
							{#each thought.tags as tag}
								<Badge variant={'secondary'}>{tag.tag.name}</Badge>
							{/each}
						</div>
					</div>
				</div>

				{#if thought.name in linkMetadata && linkMetadata[thought.name].image}
					<div class="relative hidden aspect-[4/3] sm:block">
						<img
							src={linkMetadata[thought.name].image}
							alt=""
							class="bg-muted absolute inset-0 h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
				{/if}
			</a>

			<div class="flex flex-row items-end justify-between border-t px-4 py-3">
				<p class="text-muted-foreground text-sm">
					{new Date(thought.createdAt).toLocaleString()}
				</p>
				<div class="flex justify-end">
					<Button
						onclick={() => {
							deleteThought = thought;
							deleteDialogOpen = true;
						}}
						size="icon"
						variant="outline"
					>
						<Icons.delete />
					</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}
