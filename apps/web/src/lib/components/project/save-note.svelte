<script lang="ts">
	import type { HTMLContent, JSONContent } from '@tiptap/core';
	import { Button } from '../ui/button';
	import { trpc } from '../../utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';
	import { editorState } from '../../utils/state';
	import { t } from '../../utils/i18n/translations';

	interface Props {
		jsonContent: JSONContent;
		htmlContent: HTMLContent;
		textContent: string;
	}

	const { jsonContent, htmlContent, textContent }: Props = $props();

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

	const saveNote = trpc().project.saveNote.createMutation({
		onSuccess: () => {
			const editorTabIdx = editorState.current.tabs.findIndex((tab) => tab.noteId === activeNoteId);
			editorState.current.tabs[editorTabIdx].isDirty = false;
			toast.success($t('project.save_success'));
		},
		onError: () => {
			toast.error($t('project.save_error'));
		}
	});
</script>

<Button
	size="sm"
	onclick={() =>
		$saveNote.mutate({
			noteId: activeNoteId!,
			jsonContent: JSON.stringify(jsonContent),
			htmlContent: htmlContent,
			textContent: textContent
		})}
	variant={'outline'}
>
	{$t('project.save')}
</Button>
