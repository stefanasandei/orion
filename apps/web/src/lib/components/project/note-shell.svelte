<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import type { NoteTreeNode } from '@repo/api/services';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import EditorTabs from './editor-tabs.svelte';
	import { page } from '$app/state';
	import * as Tabs from '$lib/components/ui/tabs';
	import { noteViewState } from '../../utils/state';
	import { goto, invalidateAll } from '$app/navigation';

	interface Props {
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
		children: Snippet;
	}

	const { children, project, noteTree }: Props = $props();

	const activeNoteId = $derived(
		(() => {
			const pathname = page.url.pathname;

			const parts = pathname.split('/').filter(Boolean);
			const lastSegment = parts.pop();

			if (lastSegment && !isNaN(Number(lastSegment))) {
				return Number(lastSegment);
			}

			return null;
		})()
	);
</script>

<div class="flex h-full flex-col">
	<div class="mb-2 flex flex-row items-center justify-between">
		<EditorTabs {activeNoteId} projectId={project.id} />

		<div class="flex flex-row items-center gap-2">
			<Tabs.Root
				bind:value={noteViewState.current}
				onValueChange={async (v) => {
					if (v === 'edit') {
						noteViewState.current = 'loading';
						window.location.reload();
					}
				}}
			>
				<Tabs.List>
					<Tabs.Trigger value="read">Read</Tabs.Trigger>
					<Tabs.Trigger value="edit">Edit</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
			<Sidebar.Trigger />
		</div>
	</div>
	{@render children?.()}
</div>
