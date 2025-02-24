<script lang="ts">
	interface Props {
		noteId: number;
	}

	const { noteId: _noteId }: Props = $props();
	const noteId = $derived(_noteId);

	// todo: get actual content from local storage state
	const htmlContent = $derived(`<h1>to <i>do</i>: ${noteId}</h1>`);
</script>

<div class="prose prose-lg dark:prose-invert h-full w-full">
	{@html htmlContent}
</div>
