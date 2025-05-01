<script lang="ts">
	import { useChat } from '@ai-sdk/svelte';
	import { Textarea } from '@/components/ui/textarea';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { writable, type Writable } from 'svelte/store';
	import MessageBubble from './message-bubble.svelte';
	import { t } from '@/utils/i18n/translations';
	import { Icons } from '../icons.svelte';
	import { Square } from 'lucide-svelte';
	import * as Tooltip from '@/components/ui/tooltip';
	import * as Card from '@/components/ui/card';
	import { trpc } from '../../utils/trpc/client';
	import type { Note } from '@repo/db';
	import { toast } from 'svelte-sonner';

	export let userInput: Writable<string>;
	export let userId: number;
	export let thought: Note;

	const chatInputRef = writable<HTMLInputElement | null>(null);
	const chatContainerRef = writable<HTMLDivElement | null>(null);
	const showScrollButton = writable(false);

	const trackUsage = trpc().user.trackUsage.createMutation();

	const metadata = JSON.parse(thought.jsonContent) as {
		summary: string;
		questions: string[];
	};

	const { input, handleSubmit, messages, status, stop } = useChat({
		api: `/api/chat/${thought.id}/`,

		onFinish: (_, options) => {
			$trackUsage.mutate({
				userId: userId,
				completionTokens: options.usage.completionTokens,
				promptTokens: options.usage.promptTokens
			});
		},

		onError: (error) => {
			toast.error(error.message);
			console.log(error);
		},

		maxSteps: 2
	});

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
		if (e.key === 'Enter' && !e.shiftKey && $input.trim()) handleSubmit(e);
	}

	function scrollToBottom() {
		if ($chatContainerRef) {
			$chatContainerRef.scrollTo({
				top: $chatContainerRef.scrollHeight,
				behavior: 'smooth'
			});
		}
	}

	// Check scroll position to show/hide scroll button
	function handleScroll(e: Event) {
		const container = e.target as HTMLDivElement;
		const threshold = 100; // Show button when user has scrolled up this many pixels from bottom
		const isNearBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
		showScrollButton.set(!isNearBottom);
	}

	// Auto-scroll to bottom when new messages arrive
	$: if ($messages.length > 0) {
		scrollToBottom();
	}
</script>

<div
	bind:this={$chatContainerRef}
	on:scroll={handleScroll}
	class="no-scrollbar mx-auto flex h-full min-h-fit w-full max-w-4xl flex-1 flex-col space-y-12 overflow-y-auto"
>
	{#each $messages as msg}
		{#if msg.role != 'system' && msg.role != 'data'}
			<MessageBubble isStreaming={$status == 'streaming'} {msg} />
		{/if}
	{/each}

	{#if $messages.length == 0}
		<div
			class="mx-auto flex h-full max-w-[85vw] flex-1 flex-col items-center justify-center space-y-6 md:w-full"
		>
			<Card.Root>
				<Card.Header>
					<Card.Title>{$t('dashboard.doc_overview')}</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-muted-foreground text-justify">{metadata.summary}</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="md:w-full">
				<Card.Header>
					<Card.Title>{$t('dashboard.suggested')}</Card.Title>
					<Card.Description>{$t('dashboard.suggested_desc')}</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid max-w-[80vw] gap-2">
						{#each metadata.questions as question}
							<Button
								variant="outline"
								class="h-fit max-w-[80vw] justify-start text-balance py-2 text-left"
								onclick={() => {
									$input = question;
									// handleSubmit(new Event('submit'));
								}}
							>
								<span class="py-2 md:py-0">{question}</span>
							</Button>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}

	<!-- space for the input bar-->
	<div class="min-h-[15svh] w-full md:min-h-[10svh]"></div>
</div>

<div class="pointer-events-none absolute bottom-0 z-10 w-full">
	<div class="relative mx-auto flex w-full flex-col text-center md:max-w-3xl lg:max-w-4xl">
		{#if $showScrollButton}
			<div class="flex justify-center pb-4">
				<button
					on:click={scrollToBottom}
					class="bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-ring pointer-events-auto flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
					><span class="pb-0.5">Scroll to bottom</span><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-chevron-down -mr-1 h-4 w-4"><path d="m6 9 6 6 6-6"></path></svg
					></button
				>
			</div>
		{/if}

		<div class="pointer-events-auto mb-2 w-full flex-1">
			<div class="bg-background w-full rounded-t-xl">
				<form
					on:submit={handleSubmit}
					class="bg-accent/50 flex resize-none items-start gap-2 rounded-t-xl px-4 py-2 shadow-sm"
				>
					<Textarea
						bind:ref={$chatInputRef}
						bind:value={$input}
						class="bg-accent/0 flex-1 resize-none border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						placeholder={$t('dashboard.assistant_page.chat.input_placeholder')}
						onkeydown={handleEnter}
					/>

					{#if $status == 'ready'}
						<!-- send message -->
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button variant="default" size="icon" type="submit">
									<Icons.send />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{$t('dashboard.assistant_page.send_msg')}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{:else if $status == 'submitted'}
						<!-- loading spinner -->
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button size="icon" onclick={() => stop()} variant={'outline'}>
									<div
										class="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"
									></div>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{$t('dashboard.assistant_page.loading')}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{:else if $status == 'streaming'}
						<!-- stop generation button -->
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button size="icon" onclick={() => stop()} variant={'outline'}><Square /></Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{$t('dashboard.assistant_page.stop')}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{:else}
						<!-- error button -->
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button size="icon" variant={'destructive'}><Icons.close /></Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{$status}. {$t('dashboard.assistant_page.refresh')}</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</form>

				<!-- controls -->
				<div class="bg-accent/50 flex w-full flex-row justify-between px-4 py-2">
					<a
						href={thought.textContent}
						target="_blank"
						class={buttonVariants({ variant: 'secondary', size: 'sm' })}
					>
						{$t('dashboard.assistant_page.open_tab')}
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
