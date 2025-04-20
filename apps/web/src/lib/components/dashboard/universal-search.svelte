<script lang="ts">
	import {
		BrainCircuit,
		File,
		Globe,
		Home,
		Notebook,
		NotepadText,
		Search,
		Settings,
		Sparkles
	} from 'lucide-svelte';
	import { MenuButton } from '../ui/sidebar';
	import * as Command from '$lib/components/ui/command/index.js';
	import { trpc } from '../../utils/trpc/client';
	import { Debounced } from 'runed';
	import LoadingSpinner from '../loading-spinner.svelte';
	import { goto } from '$app/navigation';

	let open = $state(false);
	let search = $state('');
	const debounced = new Debounced(() => search, 500);

	// Get search results using tRPC
	const searchResults = $derived(
		trpc().content.searchNotes.createQuery({ query: debounced.current })
	);

	function handleKeydown(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			if (e.key === 'k') {
				e.preventDefault();
				e.stopImmediatePropagation();
				open = true;
			} else if (!Number.isNaN(parseInt(e.key))) {
				const idx = parseInt(e.key);
				if (idx > 4) return;

				e.preventDefault();
				e.stopImmediatePropagation();

				const pages: Record<number, string> = {
					1: '/thoughts',
					2: '/',
					3: '/settings',
					4: '/assistant'
				};

				goto(pages[idx as keyof typeof pages]);
			}
		}

		if (e.key === 'Escape') {
			open = false;
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<MenuButton onclick={() => (open = true)}>
	<Search />
	<span>Search</span>
</MenuButton>

<Command.Dialog shouldFilter={false} class="w-full" bind:open>
	<Command.Input placeholder="Type a command or search..." bind:value={search} />
	<Command.List class="h-full max-h-max w-full">
		{#if debounced.current.length > 0}
			{#if !$searchResults.isLoading}
				<Command.Group heading="Search results">
					{#if $searchResults.data && $searchResults.data.length > 0}
						{#each $searchResults.data as result}
							<Command.Item
								onclick={async () => {
									let url = '/';

									if (
										result.type == 'document' ||
										(result.type == 'file' && result.projectId != null)
									) {
										// projects/63/doc/282
										url = `/projects/${result.projectId}/doc/${result.id}`;
									} else if (result.type == 'thought') {
										// /thoughts/326
										url = `/thoughts/${result.id}`;
									} else {
										alert(result.id);
									}

									open = false;
									await goto(url, {
										invalidateAll: true,
										replaceState: true
									});
								}}
							>
								{#if result.type === 'thought'}
									<Notebook class="text-blue-500 dark:text-blue-400" />
								{:else if result.type === 'document'}
									<NotepadText class="text-violet-500 dark:text-violet-400" />
								{:else if result.type === 'file'}
									<File class="text-fuchsia-500 dark:text-fuchsia-400" />
								{:else}
									<Globe class="text-rose-500 dark:text-rose-400" />
								{/if}
								<span
									>{result.name.length > 120
										? result.name.substring(0, 120) + '...'
										: result.name}</span
								>
							</Command.Item>
						{/each}
					{:else}
						<Command.Item
							disabled={true}
							class="text-foreground flex w-full items-center text-center"
							>No results. Please try another query.</Command.Item
						>
					{/if}
				</Command.Group>
			{:else}
				<Command.Loading>
					<LoadingSpinner className="bg-popover p-1 mt-6 overflow-hidden" />
				</Command.Loading>
			{/if}
		{:else}
			<Command.Separator />
			<Command.Group heading="Pages - quick navigation">
				<Command.Item onclick={() => goto('/thoughts')}>
					<BrainCircuit />
					<span>Library</span>
					<Command.Shortcut>⌘ 1</Command.Shortcut>
				</Command.Item>
				<Command.Item onclick={() => goto('/')}>
					<Home />
					<span>Dashboard</span>
					<Command.Shortcut>⌘ 2</Command.Shortcut>
				</Command.Item>
				<Command.Item onclick={() => goto('/settings')}>
					<Settings />
					<span>Settings</span>
					<Command.Shortcut>⌘ 3</Command.Shortcut>
				</Command.Item>
				<Command.Item onclick={() => goto('/assistant')}>
					<Sparkles />
					<span>Chat</span>
					<Command.Shortcut>⌘ 4</Command.Shortcut>
				</Command.Item>
			</Command.Group>
		{/if}
	</Command.List>
</Command.Dialog>
