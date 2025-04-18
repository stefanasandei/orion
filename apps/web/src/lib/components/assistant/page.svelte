<script lang="ts">
	import Chat from './chat.svelte';
	import Landing from './landing.svelte';
	import { writable } from 'svelte/store';
	import { page } from '$app/state';

	const prompt = page.url.searchParams.get('prompt');

	const state = writable<'landing' | 'chat'>(prompt == null ? 'landing' : 'chat');
	const userInput = writable(prompt ?? '');
</script>

<div class="flex h-full w-full flex-1 flex-col">
	{#if $state === 'landing'}
		<Landing {state} {userInput} />
	{:else}
		<Chat {userInput} />
	{/if}
</div>
