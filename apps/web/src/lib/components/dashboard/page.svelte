<script lang="ts">
	import { BrainCircuit, Plus, Settings } from 'lucide-svelte';
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
	import CreateProject from '../project/create-project.svelte';

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
	let query2text = {
		chat: $t('dashboard.chat'),
		'quick-save': $t('dashboard.quick_save'),
		search: 'Search'
	};

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
					{$t('dashboard.welcome')}, {metadata.name}!
				</h2>
				<h3
					class="text-center text-xl font-semibold text-neutral-500 md:text-4xl dark:text-neutral-300"
				>
					{$t('dashboard.home_cta')}
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
					placeholder={queryType != 'quick-save'
						? $t('dashboard.library_prompt')
						: $t('dashboard.save_prompt')}
				/>

				<div class="-mb-0 flex flex-row items-center justify-between">
					<div class="flex flex-row items-center gap-4">
						<Select.Root type="single" bind:value={queryType}>
							<Select.Trigger class="bg-accent/0 border-0 md:w-[180px]"
								>{query2text[queryType]}</Select.Trigger
							>
							<Select.Content class="bg-background">
								<Select.Item value="chat">{query2text['chat']}</Select.Item>
								<Select.Item value="quick-save">{query2text['quick-save']}</Select.Item>
								<!-- <Select.Item value="search">Research</Select.Item> -->
							</Select.Content>
						</Select.Root>

						{#if queryType == 'quick-save'}
							<p class="text-muted-foreground text-sm">
								<CommandShortcut>⌘ C</CommandShortcut>
								{$t('dashboard.switch_chat')}
							</p>
						{:else}
							<p class="text-muted-foreground text-sm">
								<CommandShortcut>⌘ Q</CommandShortcut>
								{$t('dashboard.switch_save')}
							</p>
						{/if}
					</div>

					<Button type="submit" variant="secondary" size="small-icon">
						<Icons.send />
					</Button>
				</div>
			</form>

			<div class="flex flex-col justify-evenly gap-4 md:flex-row">
				<UploadFileDialog />

				<CreateProject>
					{#snippet triggerButtonProp()}
						<div
							class="bg-accent/50 hover:bg-accent ring-accent/70 w-full items-start justify-start space-y-5 rounded-xl p-4 text-left ring-2 transition-all hover:cursor-pointer"
						>
							<Plus class="size-5" />
							<p>{$t('dashboard.create_project')}</p>
						</div>
					{/snippet}
				</CreateProject>

				<!-- <a
					href="/settings/usage"
					class="bg-accent/50 hover:bg-accent ring-accent/70 w-full space-y-5 rounded-xl p-4 ring-2 transition-all hover:cursor-pointer"
				>
					<ChartColumn class="size-5" />
					<p>View usage</p>
				</a> -->

				<a
					href="/settings/appearance"
					class="bg-accent/50 hover:bg-accent ring-accent/70 w-full space-y-5 rounded-xl p-4 ring-2 transition-all hover:cursor-pointer"
				>
					<Settings class="size-5" />
					<p>{$t('dashboard.settings')}</p>
				</a>

				<a
					href="/thoughts"
					class="bg-accent/50 hover:bg-accent ring-accent/70 w-full space-y-5 rounded-xl p-4 ring-2 transition-all hover:cursor-pointer"
				>
					<BrainCircuit class="size-5" />
					<p>{$t('dashboard.library')}</p>
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
