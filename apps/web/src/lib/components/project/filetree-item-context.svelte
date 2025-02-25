<script lang="ts">
	import * as ContextMenu from '@/components/ui/context-menu';
	import { type Snippet } from 'svelte';
	import Separator from '../ui/separator/separator.svelte';
	import type { VizItem } from '@repo/api/services';
	import DeleteNote from './delete-note.svelte';
	import MoveNote from './move-note.svelte';

	const {
		isPublicView,
		children,
		projectId,
		note,
		hasChildren
	}: {
		children: Snippet;
		note: VizItem;
		hasChildren: boolean;
		projectId: number;
		isPublicView: boolean;
	} = $props();

	let open = $state(false);

	// dirty yet it works
	let deleteDialogOpen = $state(false);
	let moveDialogOpen = $state(false);
</script>

<ContextMenu.Root bind:open>
	<ContextMenu.Trigger>
		{@render children?.()}
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item disabled={true}>{note.name}</ContextMenu.Item>
		<Separator />
		{#if hasChildren}
			<ContextMenu.Item>
				<a
					href={!isPublicView
						? `/projects/${projectId}/doc/${note.id}`
						: `/browse/project/${projectId}/${note.id}`}
					class="w-full hover:cursor-pointer"
				>
					View</a
				></ContextMenu.Item
			>
		{/if}
		<ContextMenu.Item onclick={() => (moveDialogOpen = true)} class="hover:cursor-pointer"
			>Move</ContextMenu.Item
		>
		<!-- <ContextMenu.Item>Share</ContextMenu.Item> -->
		<ContextMenu.Item onclick={() => (deleteDialogOpen = true)} class="hover:cursor-pointer"
			>Delete note</ContextMenu.Item
		>
	</ContextMenu.Content>
</ContextMenu.Root>

<DeleteNote item={note} bind:open={deleteDialogOpen} />
<MoveNote item={note} bind:open={moveDialogOpen} />
