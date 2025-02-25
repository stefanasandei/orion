<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import NoteShell from '$base/src/lib/components/project/note-shell.svelte';
	import type { NoteTreeNode } from '@repo/api/services';
	import { initializeActiveNote, noteViewState } from '$base/src/lib/utils/state';
	import { onMount } from 'svelte';
	import NoteViewer from '$base/src/lib/components/project/note-viewer.svelte';

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
			noteViewState.current = 'read';
		}
	});

	// makes navigating to another slug route reactive
	const note = $derived(data.note);
	const activeProject = $derived(data.activeProject);

	$effect(() => {
		initializeActiveNote(note);
	});
</script>

<DashboardShell pageName={'Document'} {user} {activeProject}>
	<NoteShell project={activeProject.project} isPublicView={true}>
		<NoteViewer {note} noteId={note.id} />
	</NoteShell>
</DashboardShell>
