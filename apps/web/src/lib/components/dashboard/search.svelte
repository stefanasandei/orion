<script lang="ts">
	import { trpc } from '../../utils/trpc/client';
	import LoadingSpinner from '../loading-spinner.svelte';
	import ResponsiveDialog from '../responsive-dialog.svelte';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import Separator from '../ui/separator/separator.svelte';
	import { Debounced } from 'runed';
	import ThoughtCard from './thought-card.svelte';
	import { t } from '@/utils/i18n/translations';

	let phase = $state<'search' | 'query'>('search');

	// state related to the search query
	let search = $state('');
	const debounced = new Debounced(() => search, 500);

	// get data from the query engine
	const content = $derived(
		phase == 'search'
			? trpc().content.searchNotes.createQuery({ query: debounced.current })
			: undefined
	);

	let ragResult = $state<string | null>(null);
	let isLoading = $state(false);

	// todo: broken
	// const ragQuery = trpc().content.askRag.createMutation();

	async function handleRagQuery() {
		isLoading = true;
		try {
			const result = null; /*await $ragQuery.mutateAsync({ query: search })*/
			console.debug(result);
			ragResult = result!['kwargs']['content'];
		} finally {
			isLoading = false;
		}
	}

	// handle transition from full text to RAG search
	const changeMode = () => {
		if (search.trim().length == 0) return;

		if (phase == 'search') {
			phase = 'query';
			handleRagQuery();
		} else {
			phase = 'search';
			ragResult = null;
		}
	};

	const handleSearch = () => {
		phase = 'search';
		ragResult = null;
	};

	const handleAsk = () => {
		phase = 'query';
		handleRagQuery();
	};
</script>

<ResponsiveDialog
	title={$t('dashboard.search.title')}
	class="flex h-fit max-w-5xl flex-col gap-6 transition-all"
	description=""
>
	{#snippet triggerButton()}
		<Button variant={'outline'} class="w-fit lg:w-full">{$t('dashboard.search.button')}</Button>
	{/snippet}

	<div class="flex flex-row gap-4">
		<Input bind:value={search} placeholder={$t('dashboard.search.placeholder')} class="w-full" />
		<Button onclick={handleSearch} disabled={phase === 'search' || search.trim().length === 0}>
			{$t('project.browser.search.button')}
		</Button>
		<Button onclick={handleAsk} disabled={search.trim().length === 0}>
			{$t('dashboard.search.ask')}
		</Button>
	</div>
	<Separator />

	{#if debounced.current.length > 0}
		{#if phase == 'search'}
			{#if !$content!.isLoading}
				<div class="flex h-full w-full items-center">
					<div
						class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full flex-1 overflow-x-auto"
					>
						{#if $content!.data!.length > 0}
							<div class="flex snap-x snap-mandatory gap-4 pb-4">
								{#each $content!.data! as thought}
									<div class="p-2">
										<!-- TODO: this is only for type 'thought' -->
										<ThoughtCard squared={true} {thought} />
									</div>
								{/each}
							</div>
						{:else}
							<p>{$t('project.browser.no_results')}</p>
						{/if}
					</div>
				</div>
			{:else}
				<LoadingSpinner />
			{/if}
		{:else if isLoading}
			<LoadingSpinner />
		{:else if ragResult}
			<pre class="whitespace-pre-wrap">{ragResult}</pre>
		{:else}
			<p>{$t('dashboard.search.ask_placeholder')}</p>
		{/if}
	{:else}
		<div class="flex h-full w-full items-center justify-center">
			<p>{$t('dashboard.search.empty')}</p>
		</div>
	{/if}
</ResponsiveDialog>
