<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project, ProjectPost, Tag, Comment } from '@repo/db';
	import OverviewProject from '$base/src/lib/components/project/overview-project.svelte';
	import type { NoteTreeNode } from '@repo/api/services';
	import PublicProjectMetadata from '$base/src/lib/components/project/public-project-metadata.svelte';

	interface Props {
		user: UserLocals;
		activeProject: {
			project: Project & {
				notes: Note[];
				tags: Tag[];
				user: { metadata: { name: string } };
				post: ProjectPost & { comments: Comment[] };
			};
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
		authorName={data.activeProject.project.user.metadata.name}
		project={activeProject.project}
	/>

	<PublicProjectMetadata post={data.activeProject.project.post} />
</DashboardShell>
