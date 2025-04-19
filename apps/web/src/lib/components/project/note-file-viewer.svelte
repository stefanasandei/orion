<script lang="ts">
	import type { Note } from '@repo/db';

	interface Props {
		note: Note;
	}
	const { note }: Props = $props();

	const pdfUrl = $derived(note.textContent?.trim());
</script>

<div class="flex h-screen w-full flex-col items-center justify-center">
	{#if pdfUrl}
		<iframe src={pdfUrl} title={note.name} class="h-full w-full flex-1" loading="eager"></iframe>
	{:else}
		<div class="flex h-full items-center justify-center italic text-gray-500 dark:text-gray-400">
			<p>No PDF available.</p>
		</div>
	{/if}
</div>
