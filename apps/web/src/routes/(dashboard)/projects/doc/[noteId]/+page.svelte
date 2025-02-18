<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';

	interface Props {
		user: UserLocals;
		noteId: number;
	}

	const { data }: { data: Props } = $props();
	const { user } = data;

	// makes navigating to another slug route reactive
	const note = $derived(data.noteId);
</script>

<!-- keep state also in url -->
<!-- but keep track of opened tabs in local storage, btw filetree on the left (closeable) -->

<DashboardShell pageName={'Document'} {user}>
	<p>{note}</p>
</DashboardShell>
