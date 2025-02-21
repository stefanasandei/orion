<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import Button from '@/components/ui/button/button.svelte';
	import { Badge } from '@/components/ui/badge';
	import { Icons } from '../icons.svelte';
	import OverviewHeader from './overview-header.svelte';
	import FileTree from './filetree.svelte';
	import type { NoteTreeNode } from '@repo/api/services';

	interface Props {
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
	}

	const { noteTree, project }: Props = $props();
</script>

<OverviewHeader {project} />

<div class="mt-4 flex flex-col gap-6 md:mx-auto md:max-w-5xl">
	{#if project.description !== null && project.description.length}
		<div class="p-2">
			<p class="mb-2 text-2xl">Description</p>
			<p>{project.description}</p>
		</div>
	{/if}

	<FileTree {noteTree} {project} />
</div>
