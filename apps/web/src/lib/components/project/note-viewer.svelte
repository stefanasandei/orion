<script lang="ts">
	import type { Component } from 'svelte';
	import { trpc } from '../../utils/trpc/client';
	import LoadingSpinner from '../loading-spinner.svelte';

	interface Props {
		noteId: number;
	}

	const { noteId: _noteId }: Props = $props();
	const noteId = $derived(_noteId);

	const note = $derived(trpc().project.getNote.createQuery({ noteId }));

	const htmlContent = $derived($note.data!.htmlContent);

	let HtmlPreview = $state<Component<{}, {}, any> | null>(null);

	$effect(() => {
		if ($note.isLoading) return;

		(async () => {
			const { default: HtmlPreviewComponent } = await import('../html-preview.svelte');
			HtmlPreview = HtmlPreviewComponent as Component<{}, {}, any>;
		})();
	});
</script>

<div class="prose prose-lg dark:prose-invert h-full w-full">
	{#if $note.isLoading}
		<LoadingSpinner />
	{:else}
		<!-- svelte-ignore svelte_component_deprecated -->
		<svelte:component this={HtmlPreview} {htmlContent} />
	{/if}
</div>
