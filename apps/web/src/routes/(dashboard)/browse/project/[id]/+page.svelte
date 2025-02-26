<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project, Tag } from '@repo/db';
	import OverviewProject from '$base/src/lib/components/project/overview-project.svelte';
	import type { NoteTreeNode } from '@repo/api/services';

	interface Props {
		user: UserLocals;
		activeProject: {
			project: Project & { notes: Note[]; tags: Tag[] };
			noteTree: NoteTreeNode[];
		};
	}

	const { data }: { data: Props } = $props();
	const { user } = data;

	// makes navigating to another slug route reactive
	const activeProject = $derived(data.activeProject);
</script>

<DashboardShell pageName={$t('project.page_names.project')} {user} {activeProject}>
	<OverviewProject
		isPublicView={true}
		noteTree={data.activeProject.noteTree}
		project={activeProject.project}
	/>
</DashboardShell>
