<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import EditorTabs from './editor-tabs.svelte';
	import { page } from '$app/state';
	import * as Tabs from '$lib/components/ui/tabs';
	import { noteViewState } from '../../utils/state';

	interface Props {
		isPublicView: boolean;
		project: Project & { notes: Note[] };
		children: Snippet;
	}

	const { children, project, isPublicView }: Props = $props();

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

<div class="flex h-full w-full flex-col">
	<div
		class="bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-10 mb-2 flex w-full flex-row items-center gap-4 backdrop-blur"
	>
		<div class="min-w-0 flex-1">
			<div class="scrollbar-none -mr-4 overflow-x-auto pr-4">
				<div class="w-full">
					<EditorTabs {isPublicView} {activeNoteId} projectId={project.id} />
				</div>
			</div>
		</div>

		<div class="flex flex-none shrink-0 flex-row items-center gap-2">
			{#if !isPublicView}
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
						<Tabs.Trigger value="read">{$t('project.view_mode.read')}</Tabs.Trigger>
						<Tabs.Trigger value="edit">{$t('project.view_mode.edit')}</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			{/if}
			<Sidebar.Trigger />
		</div>
	</div>

	{@render children?.()}
</div>
