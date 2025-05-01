<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import EditorTabs from './editor-tabs.svelte';
	import { page } from '$app/state';
	import * as Tabs from '$lib/components/ui/tabs';
	import { noteViewState } from '../../utils/state';
	import Button, { buttonVariants } from '../ui/button/button.svelte';
	import { Icons } from '../icons.svelte';
	import * as Tooltip from '@/components/ui/tooltip';
	import { BotMessageSquare } from 'lucide-svelte';
	import { cn } from '../../utils/cn';

	interface Props {
		isPublicView: boolean;
		project: Project & { notes: Note[] };
		children: Snippet;
		activeNote: Note;
	}

	const { children, project, isPublicView, activeNote }: Props = $props();

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

	const downloadDocument = () => {
		/* TODO: exporting documents requires way more work, needs to work nicely and be usable */

		const text = activeNote.textContent;
		const isUrl = /^https?:\/\//i.test(text);

		const a = document.createElement('a');
		a.style.display = 'none';
		a.target = '_blank';

		if (isUrl) {
			a.href = text;
			a.download = activeNote.name;
		} else {
			const blob = new Blob([activeNote.htmlContent], { type: 'text/plain' });
			a.href = URL.createObjectURL(blob);
			a.download = `${encodeURI(activeNote.name)}.html`;
		}

		a.click();

		if (!isUrl) {
			URL.revokeObjectURL(a.href);
		}
	};
</script>

<div class="flex h-full w-full flex-col">
	<div
		class="bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-10 flex w-full flex-row items-center gap-4 pb-2 backdrop-blur"
	>
		<div class="min-w-0 flex-1">
			<div class="scrollbar-none -mr-4 overflow-x-auto pr-4">
				<div class="w-full">
					<EditorTabs {isPublicView} {activeNoteId} projectId={project.id} />
				</div>
			</div>
		</div>

		<div class="flex flex-none shrink-0 flex-row items-center gap-2">
			{#if activeNote && activeNote.name.endsWith('.pdf')}
				<Tooltip.Root>
					<Tooltip.Trigger>
						<a
							href={`/thoughts/${activeNote.id}/chat`}
							class={cn(
								buttonVariants({
									size: 'sm',
									variant: 'outline'
								}),
								'mr-2'
							)}
						>
							<BotMessageSquare />
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>{$t('project.pdf_chat')}</p>
					</Tooltip.Content>
				</Tooltip.Root>

				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button onclick={downloadDocument} size="sm" class="mr-2" variant={'outline'}>
							<Icons.download />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>{$t('project.download')}</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}

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

			<!-- <Sidebar.Trigger /> -->
		</div>
	</div>

	{@render children?.()}
</div>
