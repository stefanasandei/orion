<script lang="ts">
	import ShadEditor from '@/components/shad-editor/shad-editor.svelte';
	import { editorState, updateContentForNote, type EditorTab } from '$lib/utils/state';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { Editor, type Content } from '@tiptap/core';
	import { untrack } from 'svelte';

	interface Props {
		activeNoteId: number | null;
	}

	const { activeNoteId }: Props = $props();

	let editor = $state<Editor>();
	let editorJSON = $derived(editor?.getJSON());

	let initialContent = $derived(
		(() => {
			let tabs = untrack(() => editorState.current.tabs);

			if (tabs.findIndex((tab) => tab.noteId === activeNoteId) === -1) {
				tabs = editorState.current.tabs;
			}

			const tab = tabs.find((tab) => tab.noteId === activeNoteId);

			return tab?.content;
		})()
	);

	const content = writable((() => initialContent)());

	$effect(() => {
		// set initial content, the one loaded from the db
		content.set(initialContent == undefined ? null : initialContent);
	});

	$effect(() => {
		if (activeNoteId == null || editorJSON == null) return;

		// get realtime text updates
		untrack(() => {
			// only updates local storage
			updateContentForNote(activeNoteId, editorJSON);
		});
	});

	content.subscribe((value) => {
		const _editor = untrack(() => editor);

		if (!browser || !_editor) return;
		_editor.commands.setContent(value);
	});
</script>

<main class="flex h-full w-full flex-col items-center justify-center">
	<ShadEditor bind:editor class="h-full w-full rounded-lg" content={$content} />
</main>
