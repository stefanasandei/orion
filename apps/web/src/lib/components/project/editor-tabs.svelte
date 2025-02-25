<script lang="ts">
	import { goto } from '$app/navigation';
	import { closeNoteTab, editorState, type EditorTab } from '../../utils/state';
	import { Icons } from '../icons.svelte';

	interface Props {
		isPublicView: boolean;
		activeNoteId: number | null;
		projectId: number;
	}

	const { activeNoteId, projectId, isPublicView }: Props = $props();

	let tabs = $derived<EditorTab[]>(
		editorState.current.tabs.filter((tab) => tab.projectId == projectId)
	);

	const switchTab = async (noteId: number) => {
		const url = !isPublicView
			? `/projects/${projectId}/doc/${noteId}`
			: `/browse/project/${projectId}/${noteId}`;
		await goto(url);
	};

	const closeTab = async (index: number) => {
		let noteId = tabs[index].noteId;

		closeNoteTab(noteId);

		if (noteId === activeNoteId) {
			await switchTab(tabs[0].noteId);
		}
	};
</script>

<div class="flex w-fit max-w-[60svw] flex-row gap-2 overflow-auto">
	{#each tabs as tab, index}
		<div
			class="flex flex-row items-center gap-2 rounded-lg border p-2 transition-all duration-75
				{tab.noteId === activeNoteId
				? 'bg-muted border-primary'
				: 'bg-background hover:bg-muted/50 border-border'}"
		>
			<button onclick={async () => await switchTab(tab.noteId)}
				>{tab.title}{tab.isDirty && !isPublicView ? '*' : ''}</button
			>

			{#if tab.noteId !== activeNoteId}
				<button
					class="text-foreground/50 hover:text-foreground cursor-pointer"
					onclick={async () => await closeTab(index)}
				>
					<Icons.close class="size-5" />
				</button>
			{:else}
				<button class="text-foreground/50" disabled={true}>
					<Icons.close class="size-5" />
				</button>
			{/if}
		</div>
	{/each}
</div>
