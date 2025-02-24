<script lang="ts">
	import { trpc } from '../../utils/trpc/client';
	import LoadingSpinner from '../loading-spinner.svelte';

	interface Props {
		noteId: number;
	}

	const { noteId: _noteId }: Props = $props();
	const noteId = $derived(_noteId);

	const note = $derived(trpc().project.getNote.createQuery({ noteId }));

	const htmlContent = $derived($note.data!.htmlContent);
</script>

<div class="prose prose-lg dark:prose-invert h-full w-full">
	{#if $note.isLoading}
		<LoadingSpinner />
	{:else}
		<!-- todo make this a nice centered viewer with sanitization-->
		<div class="prose prose-lg dark:prose-invert">
			{@html htmlContent}
		</div>
	{/if}
</div>
