<script lang="ts">
	import * as ContextMenu from '@/components/ui/context-menu';
	import { type Snippet } from 'svelte';
	import Separator from '../ui/separator/separator.svelte';
	import type { VizItem } from '@repo/api/services';

	const { children, note }: { children: Snippet; note: VizItem } = $props();
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		{@render children?.()}
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item disabled={true}>{note.name}</ContextMenu.Item>
		<Separator />
		<ContextMenu.Item>View</ContextMenu.Item>
		<ContextMenu.Item>Move</ContextMenu.Item>
		<ContextMenu.Item>Share</ContextMenu.Item>
		<ContextMenu.Item>Delete</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
