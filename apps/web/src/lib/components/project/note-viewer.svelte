<script lang="ts">
	import type { Component } from 'svelte';
	import { trpc } from '../../utils/trpc/client';
	import LoadingSpinner from '../loading-spinner.svelte';
	import type { Note } from '@repo/db';
	import { writable } from 'svelte/store';
	import { cn } from '../../utils/cn';
	import { t } from '@/utils/i18n/translations';

	interface Props {
		noteId: number;
		note?: Note;
	}

	const { noteId: _noteId, note: _note }: Props = $props();
	const noteId = $derived(_noteId);

	// two ways: we get the note data from server side fetching (no loading spinner)
	// this is in case we're in the viewer and not the full project viewer
	// otherwise we load each note on the client side
	const note = $derived(
		_note != undefined
			? writable({ data: _note, isLoading: false })
			: trpc().project.getNote.createQuery({ noteId })
	);

	const htmlContent = $derived($note.data!.htmlContent);
	let HtmlPreview = $state<Component<{}, {}, any> | null>(null);

	let centerContent = false;

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
	{:else if htmlContent.length === 0}
		<div class="flex h-full w-full items-center justify-center">
			<p class="text-center text-gray-500">{$t('project.no_content')}</p>
		</div>
	{:else}
		<div
			class={cn('h-full w-full overflow-auto', centerContent ? 'md:mx-auto md:max-w-[50vw]' : '')}
		>
			<!-- svelte-ignore svelte_component_deprecated -->
			<svelte:component this={HtmlPreview} {htmlContent} />
		</div>
	{/if}
</div>
