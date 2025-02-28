<script lang="ts">
	import { trpc } from '../../utils/trpc/client';
	import LoadingSpinner from '../loading-spinner.svelte';
	import ResponsiveDialog from '../responsive-dialog.svelte';
	import { Button } from '../ui/button';
	import { Input } from '../ui/input';
	import Separator from '../ui/separator/separator.svelte';
	import { Debounced } from 'runed';
	import ThoughtCard from './thought-card.svelte';

	// state related to the search query
	let search = $state('');
	const debounced = new Debounced(() => search, 500);

	// get data from the query engine
	const content = $derived(trpc().content.searchNotes.createQuery({ query: debounced.current }));
</script>

<ResponsiveDialog
	title="Search through your work"
	class="flex h-fit max-w-5xl flex-col gap-6 transition-all"
	description=""
>
	{#snippet triggerButton()}
		<Button variant={'outline'} class="w-fit lg:w-full">Search through your work</Button>
	{/snippet}

	<div class="flex flex-row gap-4">
		<Input bind:value={search} placeholder="search for anything..." class="w-full" />
		<Button>Ask</Button>
	</div>
	<Separator />

	{#if debounced.current.length > 0}
		{#if !$content.isLoading}
			<div class="flex h-full w-full items-center">
				<div
					class="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full flex-1 overflow-x-auto"
				>
					<div class="flex snap-x snap-mandatory gap-4 pb-4">
						{#each $content.data! as thought}
							<div class="p-2">
								<!-- TODO: this is only for type 'thought' -->
								<ThoughtCard squared={true} {thought} />
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<LoadingSpinner />
		{/if}
	{:else}
		<div class="flex h-full w-full items-center justify-center">
			<p>try searching for something!</p>
		</div>
	{/if}
</ResponsiveDialog>
