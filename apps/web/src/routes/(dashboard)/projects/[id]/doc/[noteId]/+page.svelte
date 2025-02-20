<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import NoteShell from '$base/src/lib/components/project/note-shell.svelte';
	import type { NoteTreeNode } from '@repo/api/services';

	interface Props {
		user: UserLocals;
		noteId: number;
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
	}

	const { data }: { data: Props } = $props();
	const { user, project, noteTree } = data;

	// makes navigating to another slug route reactive
	const note = $derived(data.noteId);
</script>

<!-- keep state also in url -->
<!-- but keep track of opened tabs in local storage, btw filetree on the left (closeable) -->

<DashboardShell pageName={'Document'} {user}>
	<NoteShell {project} {noteTree}>
		<!-- todo: make this the editor with tabs -->
		<p>{note}</p>
	</NoteShell>
</DashboardShell>
