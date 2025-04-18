<script lang="ts">
	import { useChat } from '@ai-sdk/svelte';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { writable, type Writable } from 'svelte/store';
	import MessageBubble from './message-bubble.svelte';
	import { t } from '@/utils/i18n/translations';
	import { Icons } from '../icons.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Brain, FileSearch } from 'lucide-svelte';

	export let userInput: Writable<string>;

	const chatInputRef = writable<HTMLInputElement | null>(null);
	const { input, handleSubmit, messages } = useChat();

	let state: Writable<'landing' | 'chat'>;

	// Auto-send user input from landing
	$: if ($userInput) {
		$input = $userInput;
		setTimeout(() => {
			handleSubmit(new Event('submit'));
			$chatInputRef?.focus();
			userInput.set('');
		}, 0);
	}

	function handleEnter(e: KeyboardEvent) {
		if (e.key === 'Enter' && $input.trim()) handleSubmit(e);
	}
</script>

<div class="mx-auto flex h-full w-full max-w-4xl flex-1 flex-col space-y-12">
	{#each $messages as msg}
		{#if msg.role != 'system' && msg.role != 'data'}
			<MessageBubble {msg} />
		{/if}
	{/each}

	<!-- space for the input bar-->
	<div class="min-h-[15svh] w-full md:min-h-[10svh]"></div>
</div>

<div class="pointer-events-none absolute bottom-0 z-10 w-full">
	<div class="relative mx-auto flex w-full flex-col text-center md:max-w-3xl">
		<!-- scroll to bottom todo -->

		<div class="pointer-events-auto mb-2 w-full flex-1">
			<div class="bg-background w-full rounded-t-xl">
				<form
					on:submit={handleSubmit}
					class="bg-accent/50 flex items-center gap-2 rounded-t-xl px-4 py-2 shadow-sm"
				>
					<Input
						bind:ref={$chatInputRef}
						bind:value={$input}
						class="bg-accent/0 flex-1 border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						placeholder={$t('dashboard.assistant_page.chat.input_placeholder')}
						onkeydown={handleEnter}
					/>
					<Button variant="default" class="rounded-xl" size="icon" type="submit">
						<Icons.send />
					</Button>
				</form>

				<!-- controls -->
				<div class="bg-accent/50 flex w-full flex-row px-4 py-2">
					<Tabs.Root value="chat">
						<Tabs.List class="bg-accent/0 text-accent-foreground space-x-2">
							<Tabs.Trigger
								value="chat"
								class="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
							>
								<Brain class="mr-2 size-5" />
								{$t('dashboard.assistant_page.landing.chat_tab')}
							</Tabs.Trigger>
							<Tabs.Trigger
								value="report"
								disabled
								class="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
							>
								<FileSearch class="mr-2 size-5" />
								{$t('dashboard.assistant_page.landing.report_tab')}
							</Tabs.Trigger>
						</Tabs.List>
					</Tabs.Root>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- 
<div class="bg-background absolute bottom-10 z-10 w-full px-2">
	<form
		on:submit={handleSubmit}
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
			<Icons.send />
		</Button>
	</form>
</div> -->
