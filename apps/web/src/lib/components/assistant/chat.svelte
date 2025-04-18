<script lang="ts">
	import { useChat } from '@ai-sdk/svelte';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { writable, type Writable } from 'svelte/store';
	import MessageBubble from './message-bubble.svelte';
	import { t } from '@/utils/i18n/translations';
	import { Icons } from '../icons.svelte';

	export let userInput: Writable<string>;

	const chatInputRef = writable<HTMLInputElement | null>(null);
	const { input, handleSubmit, messages } = useChat();

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

<div class="flex h-full w-full flex-col justify-between gap-4 p-4 md:max-h-[98svh]">
	<div class="flex-1 space-y-6 overflow-y-auto px-1 md:px-4">
		{#each $messages as msg}
			{#if msg.role != 'system' && msg.role != 'data'}
				<MessageBubble {msg} />
			{/if}
		{/each}
	</div>

	<div class="bg-background border-t pt-4">
		<form
			on:submit={handleSubmit}
			class="bg-accent/50 flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm"
		>
			<Input
				bind:ref={$chatInputRef}
				bind:value={$input}
				class="bg-accent/0 flex-1 border-0 ring-0 ring-offset-0 focus-visible:outline-none"
				placeholder={$t('dashboard.assistant_page.chat.input_placeholder')}
				onkeydown={handleEnter}
			/>
			<Button variant="default" size="sm" type="submit">
				<Icons.send />
			</Button>
		</form>
	</div>
</div>
