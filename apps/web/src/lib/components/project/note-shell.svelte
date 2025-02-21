<script lang="ts">
	import { Separator } from '@/components/ui/separator';
	import type { Snippet } from 'svelte';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import type { NoteTreeNode } from '@repo/api/services';
	import NoteSidebar from './note-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	interface Props {
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
		children: Snippet;
	}

	const { children, project, noteTree }: Props = $props();
</script>

<Sidebar.Trigger />

{@render children?.()}
