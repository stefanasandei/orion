<script lang="ts">
	import type { Note } from '@repo/db';
	import * as Card from '@/components/ui/card';
	import Tag from './tag.svelte';
	import { onMount } from 'svelte';

	const { thought }: { thought: Note & { tags: { tagId: number; tag: { name: string } }[] } } =
		$props();

	// Link metadata handling
	const METADATA_CACHE_KEY = 'thoughtsLinkMetadata';
	type LinkMetadata = { title: string; description: string; image: string };

	let metadata = $state<LinkMetadata>({ title: thought.name, description: '', image: '' });

	function loadMetadataFromCache(): LinkMetadata | null {
		try {
			const cached = localStorage.getItem(METADATA_CACHE_KEY);
			if (!cached) return null;
			const allMetadata = JSON.parse(cached);
			return allMetadata[thought.name] || null;
		} catch (error) {
			console.error('Failed to load metadata from cache:', error);
			return null;
		}
	}

	function saveMetadataToCache(newMetadata: LinkMetadata) {
		try {
			const cached = localStorage.getItem(METADATA_CACHE_KEY);
			const allMetadata = cached ? JSON.parse(cached) : {};
			allMetadata[thought.name] = newMetadata;
			localStorage.setItem(METADATA_CACHE_KEY, JSON.stringify(allMetadata));
		} catch (error) {
			console.error('Failed to save metadata to cache:', error);
		}
	}

	async function fetchMetadata() {
		// First try to load from cache
		const cachedMetadata = loadMetadataFromCache();
		if (cachedMetadata) {
			metadata = cachedMetadata;
			return;
		}

		// If not in cache, fetch from API
		try {
			const response = await fetch(`/api/metadata?url=${encodeURIComponent(thought.name)}`);
			const data = await response.json();
			const newMetadata = {
				title: data.title || thought.name,
				description: data.description || '',
				image: data.image || ''
			};
			metadata = newMetadata;
			saveMetadataToCache(newMetadata);
		} catch (error) {
			console.error('Failed to fetch metadata:', error);
		}
	}

	onMount(fetchMetadata);
</script>

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
						{metadata.title}
					</h3>
					{#if metadata.description}
						<p class="text-muted-foreground line-clamp-2 text-sm">
							{metadata.description}
						</p>
					{/if}
				</div>

				<div class="flex flex-row gap-2">
					<p class="text-muted-foreground flex items-center gap-2 text-xs">
						{new URL(thought.name).hostname}
					</p>
				</div>
			</div>

			{#if metadata.image}
				<div class="relative hidden aspect-[4/3] sm:block">
					<img
						src={metadata.image}
						alt=""
						class="bg-muted absolute inset-0 h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				</div>
			{/if}
		</a>

		<div class="flex flex-row items-center justify-between border-t px-4 py-3">
			<div class="flex flex-row items-center gap-2">
				<p class="text-muted-foreground text-sm">
					{new Date(thought.createdAt).toLocaleString()}
				</p>
				<div class={'flex flex-row items-center gap-1'}>
					{#each thought.tags as tag}
						<Tag name={tag.tag.name} id={tag.tagId} />
					{/each}
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
