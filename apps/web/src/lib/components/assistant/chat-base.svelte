<!-- Chat base component that can be used for both general and PDF chat -->
<script lang="ts" context="module">
	export const messages = writable<UIMessage[]>([]);
	export const inputStore = writable('');
</script>

<script lang="ts">
	import { useChat } from '@ai-sdk/svelte';
	import { Textarea } from '@/components/ui/textarea';
	import { Button } from '@/components/ui/button';
	import { writable, type Writable } from 'svelte/store';
	import MessageBubble from './message-bubble.svelte';
	import { t } from '@/utils/i18n/translations';
	import { Icons } from '../icons.svelte';
	import { Square } from 'lucide-svelte';
	import * as Tooltip from '@/components/ui/tooltip';
	import { trpc } from '../../utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { type UIMessage } from 'ai';

	interface ChatOptions {
		apiEndpoint: string;
		maxSteps?: number;
	}

	interface Props {
		userInput: Writable<string>;
		userId: number;
		options: ChatOptions;
		children?: ConstructorOfATypedSvelteComponent;
	}

	export let userInput: Props['userInput'];
	export let userId: Props['userId'];
	export let options: Props['options'];

	const chatInputRef = writable<HTMLInputElement | null>(null);
	const chatContainerRef = writable<HTMLDivElement | null>(null);

	const shouldAutoScroll = writable(true);
	const showScrollButton = writable(false);

	const trackUsage = trpc().user.trackUsage.createMutation();

	const {
		input,
		handleSubmit,
		messages: chatMessages,
		status,
		stop
	} = useChat({
		api: options.apiEndpoint,
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
		maxSteps: options.maxSteps ?? 5
	});

	// Update the shared stores
	$: $messages = $chatMessages;
	$: $inputStore = $input;

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

	// Check scroll position to show/hide scroll button and toggle auto-scroll
	function handleScroll(e: Event) {
		const container = e.target as HTMLDivElement;
		const threshold = 100;
		const isNearBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

		if (isNearBottom) {
			shouldAutoScroll.set(true);
			showScrollButton.set(false);
		} else {
			shouldAutoScroll.set(false);
			showScrollButton.set(true);
		}
	}

	// Only auto-scroll when new messages arrive AND we're still at/near bottom
	$: if ($messages.length > 0 && $shouldAutoScroll) {
		scrollToBottom();
	}
</script>

<!-- Chat messages container -->
<div
	bind:this={$chatContainerRef}
	on:scroll={handleScroll}
	class="no-scrollbar mx-auto flex h-full w-full max-w-4xl flex-1 flex-col space-y-12 overflow-y-auto"
>
	<slot name="pre-messages" />

	{#each $messages as msg}
		{#if msg.role !== 'system' && msg.role !== 'data'}
			<MessageBubble isStreaming={$status === 'streaming'} {msg} />
		{/if}
	{/each}

	<!-- spacer so input bar doesn't cover last message -->
	<div class="min-h-[15svh] w-full md:min-h-[15svh]"></div>
</div>

<!-- Scroll button + input area -->
<div class="pointer-events-none absolute bottom-0 z-10 w-full">
	<div class="relative mx-auto flex w-full flex-col text-center md:max-w-3xl lg:max-w-4xl">
		{#if $showScrollButton}
			<div class="pointer-events-auto flex justify-center pb-4">
				<button
					on:click={() => {
						scrollToBottom();
						shouldAutoScroll.set(true);
					}}
					class="bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-ring flex h-8 items-center justify-center gap-2 rounded-full px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
				>
					<span class="pb-0.5">Scroll to bottom</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-chevron-down -mr-1 h-4 w-4"
					>
						<path d="m6 9 6 6 6-6"></path>
					</svg>
				</button>
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

					{#if $status === 'ready'}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button variant="default" size="icon" type="submit">
									<Icons.send />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content><p>Send message</p></Tooltip.Content>
						</Tooltip.Root>
					{:else if $status === 'submitted'}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button size="icon" onclick={() => stop()} variant="outline">
									<div
										class="border-primary size-4 animate-spin rounded-full border-2 border-t-transparent"
									></div>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content><p>Loading...</p></Tooltip.Content>
						</Tooltip.Root>
					{:else if $status === 'streaming'}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button size="icon" onclick={() => stop()} variant="outline">
									<Square />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content><p>Stop generation</p></Tooltip.Content>
						</Tooltip.Root>
					{:else}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button size="icon" variant="destructive"><Icons.close /></Button>
							</Tooltip.Trigger>
							<Tooltip.Content><p>{$status}. Please refresh page</p></Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</form>

				<slot name="controls" />
			</div>
		</div>
	</div>
</div>
