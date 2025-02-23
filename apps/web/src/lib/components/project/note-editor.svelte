<script lang="ts">
	import ShadEditor from '@/components/shad-editor/shad-editor.svelte';
	import { editorState, type EditorTab } from '$lib/utils/state';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { Editor, type Content } from '@tiptap/core';

	interface Props {
		activeNoteId: number | null;
	}

	const { activeNoteId }: Props = $props();

	let tabs = $state<EditorTab[]>(editorState.current.tabs);
	let editor = $state<Editor>();
	let editorJSON = $derived(editor?.getJSON());

	let initialContent = $derived(
		(() => {
			const tab = tabs.find((tab) => tab.noteId === activeNoteId);

			return tab?.content;
		})()
	);

	$effect(() => {
		// set initial content, the one loaded from the db
		content.set(initialContent ?? '');
	});

	$effect(() => {
		// get realtime text updates
		console.log(editorJSON);
	});

	const content = writable((() => initialContent)());
	content.subscribe((value) => {
		if (!browser || !editor) return;
		editor.commands.setContent(value);
	});
</script>

<main class="flex h-full w-full flex-col items-center justify-center">
	<ShadEditor bind:editor class="h-full w-full rounded-lg" content={$content} />
</main>
