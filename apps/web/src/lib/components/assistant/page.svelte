<script lang="ts">
	import Chat from './chat.svelte';
	import Landing from './landing.svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { t } from '@/utils/i18n/translations';

	// @ts-ignore
	import { hasAIEnabled } from '@repo/api/enabled-ai';

	const { userId }: { userId: number } = $props();

	const prompt = page.url.searchParams.get('prompt');

	let state = writable<'landing' | 'chat'>(prompt == null ? 'landing' : 'chat');
	const userInput = writable(prompt ?? '');

	if (!hasAIEnabled(userId)) {
		$state = 'landing';

		toast.error($t('dashboard.ai_not_enabled'));
		goto('/');
	}
</script>

<div class="flex h-full w-full flex-1 flex-col">
	{#if $state === 'landing'}
		<Landing {state} {userInput} />
	{:else}
		<Chat {userInput} {userId} />
	{/if}
</div>
