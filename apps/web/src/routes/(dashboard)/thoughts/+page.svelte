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

	let { data: _data }: { data: { user: UserLocals; notes: Note[] } } = $props();
	const { user, notes: _notes } = $derived(_data);
	const thoughts = $derived(_notes.filter((n) => n.type == 'thought'));

	let newThought = $state('');

	let deleteThought = $state<Note>();
	let deleteDialogOpen = $state(false);

	let cachedHtml = $state<Map<string, string>>(new Map());

	const addNewThought = trpc().project.createQuickNote.createMutation({
		onSuccess: async () => {
			toast.success($t('dashboard.quick_thoughts.success'));
			newThought = '';
			await invalidateAll();
		}
	});

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

	let containerEl = $state({ containers: mapProxy(new Map<number, HTMLElement>()) });
	let isOverflowing = $state({ containers: mapProxy(new Map<number, boolean>()) });

	// whenever content (or DOM) updates, re-check overflow
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

	onMount(checkOverflow);
	$effect(checkOverflow);

	//TODO: edit, search, tags
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
				{@render thoughtCard(thought)}
			{/each}
		</div>
	</div>
</DashboardShell>

<DeleteNote item={{ id: deleteThought?.id!, name: '' }} bind:open={deleteDialogOpen} />

{#snippet thoughtCard(thought: Note)}
	<Card.Root class="bg-card transition-colors duration-75">
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
				<p class="text-muted-foreground text-sm">
					{new Date(thought.createdAt).toLocaleString()}
				</p>

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
