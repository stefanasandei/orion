<script lang="ts">
	import ShadEditor from '@/components/shad-editor/shad-editor.svelte';
	import { editorState, noteViewState, updateContentForNote } from '$lib/utils/state';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { Editor } from '@tiptap/core';
	import { untrack } from 'svelte';
	import NoteViewer from './note-viewer.svelte';
	import LoadingSpinner from '../loading-spinner.svelte';
	import { preferences } from '@/utils/stores';
	import CodeMirror from 'svelte-codemirror-editor';

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

	let value = $state("todo: codemirror doesn't work yet");
</script>

<main class="flex h-full w-full flex-col items-center justify-center">
	{#if noteViewState.current == 'edit'}
		{#if $preferences.useRichTextEditor}
			<ShadEditor bind:editor class="h-full w-full rounded-lg" content={$content} />
		{:else}
			<!-- todo: add raw text (md) editor, this is a mess at the moment-->
			<!-- work on light/dark themes, proper state (shad's state management is a MESS, while codemirror's is alright - now I have to make some abstraction so it works with both??)-->
			<CodeMirror class="h-full w-full" bind:value />
		{/if}
	{:else if noteViewState.current == 'loading'}
		<LoadingSpinner />
	{:else if noteViewState.current == 'read'}
		<NoteViewer noteId={activeNoteId!} />
	{/if}
</main>
