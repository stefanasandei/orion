<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import NoteShell from '$base/src/lib/components/project/note-shell.svelte';
	import type { NoteTreeNode } from '@repo/api/services';
	import NoteEditor from '$base/src/lib/components/project/note-editor.svelte';
	import { initializeActiveNote, noteViewState } from '$base/src/lib/utils/state';
	import { onMount } from 'svelte';
	import NoteFileViewer from '$base/src/lib/components/project/note-file-viewer.svelte';

	// server-side props
	interface Props {
		user: UserLocals;
		note: Note;
		activeProject: {
			project: Project & { notes: Note[] };
			noteTree: NoteTreeNode[];
		};
	}

	const { data }: { data: Props } = $props();
	const { user } = data;

	onMount(() => {
		if (noteViewState.current == 'loading') {
			noteViewState.current = 'edit';
		}
	});

	// makes navigating to another slug route reactive
	const note = $derived(data.note);
	const activeProject = $derived(data.activeProject);

	$effect(() => {
		// make the current note active (in the tabs & editor)
		const currNoteId = note.id;
		// console.log('current: ' + currNoteId.toString());
		initializeActiveNote(note);

		return () => {
			// acces to the old note, just in case
			// console.log('old: ' + currNoteId.toString());
		};
	});
</script>

<DashboardShell pageName={$t('project.page_names.document')} {user} {activeProject}>
	<NoteShell project={activeProject.project} activeNote={note} isPublicView={false}>
		{#if note.type == 'document'}
			<NoteEditor activeNoteId={note.id} />
		{:else if note.type == 'file'}
			<NoteFileViewer {note} />
		{/if}
	</NoteShell>
</DashboardShell>
