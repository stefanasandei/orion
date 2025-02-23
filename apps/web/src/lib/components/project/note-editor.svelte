<script lang="ts">
	import ShadEditor from '@/components/shad-editor/shad-editor.svelte';
	import { editorTabs, type EditorTab } from '$lib/utils/state';
	import { writable } from 'svelte/store';

	interface Props {
		activeNoteId: number | null;
	}

	const { activeNoteId }: Props = $props();

	let tabs = $state<EditorTab[]>(editorTabs.current);

	let initialContent = $derived(
		(() => {
			const tab = tabs.find((tab) => tab.noteId === activeNoteId);

			return tab?.content;
		})()
	);

	// TODO
	const content = writable(() => initialContent);

	content.subscribe((value) => {
		console.log('Content Changed');
	});
</script>

<main class="flex h-full w-full flex-col items-center justify-center">
	<ShadEditor class="h-full w-full rounded-lg" content={$content} />
</main>
