<script lang="ts">
	import type { Note } from '@repo/db';
	import * as Card from '../ui/card';
	import { Badge } from '../ui/badge';
	import Tag from './tag.svelte';
	import { Button, buttonVariants } from '../ui/button';
	import { Pen } from 'lucide-svelte';
	import { Icons } from '../icons.svelte';
	import DeleteNote from '../project/delete-note.svelte';

	interface Props {
		thought: Note & { tags: { tagId: number; tag: { name: string } }[] };
		isPreview?: boolean;
	}

	const { thought, isPreview }: Props = $props();

	let deleteDialogOpen = $state(false);

	const isImage = (text: string): boolean => {
		return text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.jpeg');
	};
</script>

<Card.Root class="bg-card hover:bg-muted/50 transition-colors duration-75">
	<Card.Content class="flex flex-col justify-between space-y-2 pb-2">
		<a
			href={thought.textContent}
			target="_blank"
			class="group relative w-full flex-1 cursor-pointer overflow-hidden"
		>
			<div class="w-full overflow-x-auto">
				<div class="flex flex-row justify-between">
					<span class="text-foreground text-xl">{thought.name}</span>
					<Badge variant={'default'}>File</Badge>
				</div>

				{#if isImage(thought.name)}
					<img class="my-4 rounded-lg" src={thought.textContent} alt={thought.name} />
				{:else if thought.name.endsWith('.pdf')}
					<iframe
						src={thought.textContent}
						title={thought.name}
						class="my-4 h-full min-h-60 w-full flex-1 md:min-h-96"
					></iframe>
				{/if}
			</div>
		</a>

		<div class="flex flex-row items-end justify-between">
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

			{#if isPreview !== true}
				<div class="flex flex-row justify-end gap-2">
					<a
						href={`/thoughts/${thought.id}/edit`}
						class={buttonVariants({ variant: 'outline', size: 'icon' })}
					>
						<Pen class="size-4" />
					</a>

					<Button
						onclick={() => {
							deleteDialogOpen = true;
						}}
						size="icon"
						variant="outline"
					>
						<Icons.delete />
					</Button>
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>

<DeleteNote item={{ id: thought.id, name: '' }} bind:open={deleteDialogOpen} />
