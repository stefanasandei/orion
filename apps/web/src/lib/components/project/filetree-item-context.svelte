<script lang="ts">
	import * as ContextMenu from '@/components/ui/context-menu';
	import { type Snippet } from 'svelte';
	import Separator from '../ui/separator/separator.svelte';
	import type { VizItem } from '@repo/api/services';
	import DeleteNote from './delete-note.svelte';

	const { children, note }: { children: Snippet; note: VizItem } = $props();

	let open = $state(false);
	let deleteDialogOpen = $state(false); // New state for dialog control
</script>

<ContextMenu.Root bind:open>
	<ContextMenu.Trigger>
		{@render children?.()}
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item disabled={true}>{note.name}</ContextMenu.Item>
		<Separator />
		<ContextMenu.Item>View</ContextMenu.Item>
		<ContextMenu.Item>Move</ContextMenu.Item>
		<ContextMenu.Item>Share</ContextMenu.Item>
		<ContextMenu.Item onclick={() => (deleteDialogOpen = true)} class="hover:cursor-pointer"
			>Delete note</ContextMenu.Item
		>
	</ContextMenu.Content>
</ContextMenu.Root>

<DeleteNote item={note} bind:open={deleteDialogOpen} />
