<script lang="ts">
	import type { Note } from '@repo/db';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Icons } from '../icons.svelte';
	import Tag from './tag.svelte';
	import HtmlPreview from '../html-preview.svelte';
	import { parse } from 'marked';
	import { onMount } from 'svelte';

	const { thought }: { thought: Note & { tags: { tagId: number; tag: { name: string } }[] } } =
		$props();

	// Markdown rendering
	let html = $state('');
	$effect(() => {
		html = parse(thought.name, { async: false }) as string;
	});

	// Overflow detection
	let containerEl: HTMLElement;
	let isOverflowing = $state(false);

	const checkOverflow = () => {
		if (containerEl) {
			isOverflowing = containerEl.scrollHeight > containerEl.clientHeight;
		}
	};

	onMount(checkOverflow);
	$effect(checkOverflow);
</script>

<Card.Root class="bg-card hover:bg-muted/50 transition-colors duration-75">
	<Card.Content class="flex flex-col justify-between space-y-2 pb-2">
		<a
			href={`/thoughts/${thought.id}`}
			bind:this={containerEl}
			class="group relative max-h-60 w-full flex-1 cursor-pointer overflow-hidden"
		>
			<div class="w-full overflow-x-auto">
				<div class="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-full">
					<HtmlPreview className="text-xl" htmlContent={html} />
				</div>
			</div>

			{#if isOverflowing}
				<div
					class="from-card pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t to-transparent transition-opacity duration-300 group-hover:opacity-50"
				></div>
			{/if}
		</a>

		<div class="flex flex-row items-end justify-between pt-2">
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
