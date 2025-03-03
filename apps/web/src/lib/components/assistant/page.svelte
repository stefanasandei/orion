<!-- Vercel's AI sdk doesn't support Svelte - yet they own the framework :/ -->
<svelte:options runes={false} />

<script lang="ts">
	import { Brain, FileSearch } from 'lucide-svelte';
	import { Icons } from '../icons.svelte';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { useChat } from '@ai-sdk/svelte';
	import { writable } from 'svelte/store';
	import HtmlPreview from '../html-preview.svelte';
	import { cn } from '../../utils/cn';
	import { formatMessageContent } from '../../utils/assistant-msg';
	import { t } from '@/utils/i18n/translations';

	interface Props {
		user: { id: number };
	}

	// const { user }: Props = $props();

	// const state = $state<'landing' | 'chat'>('chat');
	$: state = 'landing';

	const handleEnter = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && $input.trim()) {
			handleSubmit(e);
		}
	};

	// imported from Vercel's AI sdk - utilities to handle chat - server streaming state
	const { input, handleSubmit, messages } = useChat();

	let landingInput = '';
	const chatInputRef = writable<HTMLInputElement | null>(null);

	const handleLandingSubmit = (e: Event) => {
		e.preventDefault();
		if (!landingInput.trim()) return;

		state = 'chat';
		$input = landingInput;
		// Small delay to ensure state transition and DOM update is complete
		setTimeout(() => {
			handleSubmit(e);
			$chatInputRef?.focus();
		}, 0);
	};

	const handleLandingEnter = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && landingInput.trim()) {
			handleLandingSubmit(e);
		}
	};
</script>

{#if state == 'landing'}
	<div class="flex h-full w-full flex-col">
		<main class="flex flex-1 items-center justify-center p-4">
			<div class="flex w-full max-w-3xl flex-col justify-center gap-6">
				<h2 class="text-center text-2xl font-semibold md:text-4xl">
					{$t('dashboard.assistant_page.landing.title')}
				</h2>

				<form
					onsubmit={handleLandingSubmit}
					class="bg-accent/50 flex flex-col gap-6 rounded-xl p-4 shadow-sm"
				>
					<Input
						bind:value={landingInput}
						onkeydown={handleLandingEnter}
						class="bg-accent/0 flex-1 border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						placeholder={$t('dashboard.assistant_page.landing.input_placeholder')}
					/>

					<div class="-mb-0 flex flex-row items-center justify-between">
						<Tabs.Root value="chat">
							<Tabs.List class="bg-accent/0 text-accent-foreground space-x-2">
								<Tabs.Trigger
									class="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
									value="chat"
								>
									<Brain class="mr-2 size-5" />
									{$t('dashboard.assistant_page.landing.chat_tab')}
								</Tabs.Trigger>
								<Tabs.Trigger
									disabled={true}
									class="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
									value="report"
								>
									<FileSearch class="mr-2 size-5" />
									{$t('dashboard.assistant_page.landing.report_tab')}
								</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>

						<Button type="submit" variant="secondary" size="small-icon">
							<Icons.send />
						</Button>
					</div>
				</form>
			</div>
		</main>

		<footer class="p-4">
			<p class="text-muted-foreground text-center text-sm">
				{$t('dashboard.assistant_page.landing.footer_text')}
			</p>
		</footer>
	</div>
{:else}
	<div class="flex h-full w-full flex-col justify-between gap-4 p-4 md:max-h-[98svh]">
		<div class="flex-1 space-y-6 overflow-y-auto px-1 md:px-4">
			{#each $messages as message}
				<div class="flex flex-col {message.role === 'user' ? 'items-end' : 'items-start'}">
					<div
						class={cn(
							'flex items-start gap-2.5',
							message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
						)}
					>
						<div class="flex flex-col gap-1 md:max-w-[80%]">
							<div class={'text-muted-foreground w-full text-sm'}>
								{message.role === 'user'
									? $t('dashboard.assistant_page.chat.you')
									: $t('dashboard.assistant_page.chat.assistant')}
							</div>

							<div
								class={cn(
									'flex w-fit items-start rounded-lg px-4 py-2',
									message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
								)}
							>
								{#if message.role == 'assistant'}
									<HtmlPreview htmlContent={formatMessageContent(message.content)} />
								{:else}
									<p>{message.content}</p>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="bg-background border-t pt-4">
			<form
				onsubmit={handleSubmit}
				class="bg-accent/50 flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm"
			>
				<Input
					bind:ref={$chatInputRef}
					bind:value={$input}
					class="bg-accent/0 flex-1 border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder={$t('dashboard.assistant_page.chat.input_placeholder')}
					onkeydown={handleEnter}
				/>
				<Button variant="default" size="sm" type="submit">
					<Icons.send class="size-4" />
				</Button>
			</form>
		</div>
	</div>
{/if}
