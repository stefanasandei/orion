<script lang="ts">
	import { Separator } from '@/components/ui/separator';
	import type { Snippet } from 'svelte';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import type { NoteTreeNode } from '@repo/api/services';
	import ProjectFiletree from './project-filetree.svelte';

	interface Props {
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
		children: Snippet;
	}

	const { children, project, noteTree }: Props = $props();
</script>

<div class="grid h-full grid-cols-12 gap-4 overflow-hidden">
	<main class="col-span-9">
		{@render children?.()}
	</main>

	<!-- make this a collapsible sidebar -->
	<aside class="bg-muted/40 col-span-3 h-full rounded-lg px-3 py-2">
		<div class="sticky top-0">
			<ProjectFiletree {project} {noteTree} />
		</div>
	</aside>
</div>
