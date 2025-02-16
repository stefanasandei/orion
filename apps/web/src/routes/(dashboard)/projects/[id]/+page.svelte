<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import OverviewProject from '$base/src/lib/components/project/overview-project.svelte';
	import type { NoteTreeNode } from '@repo/api/services';

	interface Props {
		user: UserLocals;
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
	}

	const { data }: { data: Props } = $props();
	const { user } = data;

	// makes navigating to another slug route reactive
	const project = $derived(data.project);
</script>

<DashboardShell pageName={'Project'} {user}>
	<OverviewProject noteTree={data.noteTree} {project} />
</DashboardShell>
