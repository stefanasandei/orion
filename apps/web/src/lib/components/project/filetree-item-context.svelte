<script lang="ts">
	import * as ContextMenu from '@/components/ui/context-menu';
	import { type Snippet } from 'svelte';
	import Separator from '../ui/separator/separator.svelte';
	import type { VizItem } from '@repo/api/services';
	import DeleteNote from './delete-note.svelte';
	import MoveNote from './move-note.svelte';
	import { t } from '../../utils/i18n/translations';
	import { toast } from 'svelte-sonner';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';

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

	let noteURL = $derived(
		!isPublicView
			? `/projects/${projectId}/doc/${note.id}`
			: `/browse/project/${projectId}/${note.id}`
	);
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
				<a href={noteURL} class="w-full hover:cursor-pointer">
					{$t('project.view')}</a
				></ContextMenu.Item
			>
		{/if}

		<ContextMenu.Item
			class="hover:cursor-pointer"
			onclick={() => {
				navigator.clipboard.writeText(`${PUBLIC_WEBSITE_URL}${noteURL}`);
				toast('Document URL copied!');
			}}>{$t('project.share')}</ContextMenu.Item
		>

		{#if !isPublicView}
			<ContextMenu.Item onclick={() => (moveDialogOpen = true)} class="hover:cursor-pointer"
				>{$t('project.move')}</ContextMenu.Item
			>
			<ContextMenu.Item onclick={() => (deleteDialogOpen = true)} class="hover:cursor-pointer"
				>{$t('project.delete_note_menu')}</ContextMenu.Item
			>
		{/if}
	</ContextMenu.Content>
</ContextMenu.Root>

<DeleteNote item={note} bind:open={deleteDialogOpen} />
<MoveNote item={note} bind:open={moveDialogOpen} />
