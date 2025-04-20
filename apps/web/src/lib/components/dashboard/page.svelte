<script lang="ts">
	import { Brain, BrainCircuit, File, FileSearch, Link, Plus, Upload } from 'lucide-svelte';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { t } from '@/utils/i18n/translations';
	import { Icons } from '../icons.svelte';
	import { toast } from 'svelte-sonner';
	import type { UserLocals } from '@repo/core';
	import type { Note } from '@repo/db';
	import { Textarea } from '../ui/textarea';
	import * as Select from '@/components/ui/select';
	import { goto, invalidateAll } from '$app/navigation';
	import { trpc } from '../../utils/trpc/client';
	import { CommandShortcut } from '@/components/ui/command';
	import UploadFileDialog from './upload-file-dialog.svelte';

	interface Props {
		user: UserLocals;
		notes: Note[];
	}

	const { user, notes: _notes }: Props = $props();
	const { metadata } = user.user!;

	let input = $state('');

	// quick save - save a "quick thought" to the database, chat - redirect to /assistant with the prompt
	// search - use universal search api to query the knowledge base
	let queryType = $state<'chat' | 'quick-save' | 'search'>('quick-save');
	let query2text = { chat: 'Chat', 'quick-save': 'Quick Save', search: 'Search' };

	const addNewThought = trpc().project.createQuickNote.createMutation({
		onSuccess: async () => {
			toast.success($t('dashboard.quick_thoughts.success'));
			await invalidateAll();
		}
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!input.trim()) return;

		// redirect to the assistant page for chats
		if (queryType == 'chat') {
			goto(`/assistant?prompt=${input}`);
		} else if (queryType == 'quick-save') {
			const data = input;
			input = '';

			$addNewThought.mutate({
				content: data,
				type: 'thought'
			});
		} else toast('TODO: unimplemented!');
	}

	function handleTextareaKeydown(e: KeyboardEvent) {
		// this way we can send on enter, and add a new line on shift+enter
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	}

	function handleGlobalKeydown(e: KeyboardEvent) {
		if (e.key == 'q' && e.ctrlKey) {
			e.preventDefault();
			queryType = 'quick-save';
		} else if (e.key == 'c' && e.ctrlKey) {
			e.preventDefault();
			queryType = 'chat';
		}
	}
</script>

<svelte:document onkeydown={handleGlobalKeydown} />

<div class="flex h-full w-full flex-col">
	<main class="flex flex-1 items-center justify-center p-4">
		<div class="flex w-full max-w-3xl flex-col justify-center gap-6">
			<div>
				<h2 class="text-center text-2xl font-semibold md:text-4xl">
					Welcome, {metadata.name}!
				</h2>
				<h3 class="text-center text-xl font-semibold text-neutral-400 md:text-4xl">
					{'What will you discover today?'}
				</h3>
			</div>

			<form
				onsubmit={handleSubmit}
				class="hover:ring-accent bg-accent/50 flex flex-col gap-6 rounded-xl p-4 shadow-sm ring-inset transition-all hover:ring-2"
			>
				<Textarea
					onkeydown={handleTextareaKeydown}
					bind:value={input}
					class="bg-accent/0 flex-1 resize-none border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder={'Ask your library a question...'}
				/>

				<div class="-mb-0 flex flex-row items-center justify-between">
					<div class="flex flex-row items-center gap-4">
						<Select.Root type="single" bind:value={queryType}>
							<Select.Trigger class="bg-accent/0 border-0 md:w-[180px]"
								>{query2text[queryType]}</Select.Trigger
							>
							<Select.Content class="bg-background">
								<Select.Item value="chat">Chat</Select.Item>
								<Select.Item value="quick-save">Quick Save</Select.Item>
								<Select.Item value="search">Search</Select.Item>
							</Select.Content>
						</Select.Root>

						{#if queryType == 'quick-save'}
							<p class="text-muted-foreground text-sm">
								<CommandShortcut>⌘ C</CommandShortcut>
								to switch to Chat
							</p>
						{:else}
							<p class="text-muted-foreground text-sm">
								<CommandShortcut>⌘ Q</CommandShortcut>
								to switch to Quick Save
							</p>
						{/if}
					</div>

					<Button type="submit" variant="secondary" size="small-icon">
						<Icons.send />
					</Button>
				</div>
			</form>

			<div class="flex flex-col justify-evenly gap-4 md:flex-row">
				<div class="w-full">
					<UploadFileDialog />
				</div>
				<div
					class="bg-accent/50 hover:bg-accent ring-accent/70 w-full space-y-5 rounded-xl p-4 ring-2 transition-all hover:cursor-pointer"
				>
					<Link class="size-5" />
					<p>Import from URL</p>
				</div>
				<div
					class="bg-accent/50 hover:bg-accent ring-accent/70 w-full space-y-5 rounded-xl p-4 ring-2 transition-all hover:cursor-pointer"
				>
					<Plus class="size-5" />
					<p>Create a document</p>
				</div>
				<a
					href="/thoughts"
					class="bg-accent/50 hover:bg-accent ring-accent/70 w-full space-y-5 rounded-xl p-4 ring-2 transition-all hover:cursor-pointer"
				>
					<BrainCircuit class="size-5" />
					<p>Library</p>
				</a>
			</div>
		</div>
	</main>

	<footer class="pt-4">
		<p class="text-muted-foreground text-center text-sm">
			{$t('dashboard.assistant_page.landing.footer_text')}
		</p>
	</footer>
</div>
