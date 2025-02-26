<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { trpc } from '@/utils/trpc/client';
	import { t } from '@/utils/i18n/translations';
	import { invalidateAll } from '$app/navigation';
	import ResponsiveDialog from '@/components/responsive-dialog.svelte';
	import MiniSearch from 'minisearch';
	import type { VizItem } from '@repo/api/services';

	let {
		open = $bindable(),
		item
	}: {
		open: boolean;
		item: { id: number; name: string };
	} = $props();

	// full text search
	const miniSearch = new MiniSearch({
		fields: ['name'],
		storeFields: ['name', 'id'],
		searchOptions: {
			fuzzy: true
		}
	});
	let loaded = $state(false);

	let selectedNote = $state<VizItem | null>(null);

	let query = $state('');
	let results = $derived(
		(() => {
			return miniSearch.search(query, { fields: ['name'] });
		})()
	);

	// load the data first
	const neigborNotes = trpc().project.getNeighborNotes.createQuery({ noteId: item.id });

	$effect(() => {
		if ($neigborNotes.data == undefined || loaded) return;

		miniSearch.addAll($neigborNotes.data);
		loaded = true;
	});

	// mutation
	const moveNote = trpc().project.makeNoteParentTo.createMutation({
		onSuccess: async () => {
			toast($t('project.note_moved'));
			open = false;
			await invalidateAll();
		},

		onError: () => {
			toast.error($t('project.update_error'));
			open = false;
		}
	});
</script>

<ResponsiveDialog
	title={$t('project.move_note_title')}
	description={$t('project.move_note_desc')}
	hasTrigger={false}
	bind:open
	>{#snippet triggerButton()}{/snippet}

	<Label>{$t('project.search_note')}</Label>
	<Input
		bind:value={query}
		disabled={$neigborNotes.isLoading}
		placeholder={$t('project.doc_filename')}
	/>

	{#if $neigborNotes.isLoading}
		<div class="flex h-full w-full items-center justify-center">
			<div
				class="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"
			></div>
		</div>
	{:else}
		<div class="mt-3 flex h-full flex-col justify-between">
			<div class="flex flex-col gap-3">
				{#if results.length != 0}
					{#each results as note}
						<Button
							onclick={() => (selectedNote = { id: note.id, name: note.name! })}
							class="w-full"
							variant={'outline'}
							size="sm">{note.name}</Button
						>
					{/each}
				{:else}
					{#each $neigborNotes.data!.slice(0, 5) as note}
						<Button
							onclick={() => (selectedNote = note)}
							class="w-full"
							variant={'outline'}
							size="sm">{note.name}</Button
						>
					{/each}
				{/if}
			</div>

			<Button
				class="w-full"
				onclick={() => {
					$moveNote.mutate({
						childNoteId: item.id,
						parentNoteId: selectedNote ? selectedNote.id : null
					});
				}}
				variant={'default'}
				size="sm"
				>{selectedNote
					? $t('project.select_note', { default: selectedNote.name })
					: $t('project.select_none')}</Button
			>
		</div>
	{/if}
</ResponsiveDialog>
