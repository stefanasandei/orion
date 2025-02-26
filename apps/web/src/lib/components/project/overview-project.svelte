<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project, Tag } from '@repo/db';
	import OverviewHeader from './overview-header.svelte';
	import FileTree from './filetree.svelte';
	import type { NoteTreeNode } from '@repo/api/services';

	interface Props {
		isPublicView?: boolean;
		authorName?: string;
		project: Project & { notes: Note[]; tags: Tag[] };
		noteTree: NoteTreeNode[];
	}

	const { noteTree, project, isPublicView = false, authorName }: Props = $props();
</script>

<OverviewHeader {authorName} {isPublicView} {project} />

<div class="mt-4 flex flex-col gap-6 md:mx-auto md:max-w-5xl">
	{#if project.description !== null && project.description.length}
		<div class="p-2">
			<p class="mb-2 text-2xl">{$t('project.overview.description_title')}</p>
			<p>{project.description}</p>
		</div>
	{/if}

	<FileTree {isPublicView} {noteTree} {project} />
</div>
