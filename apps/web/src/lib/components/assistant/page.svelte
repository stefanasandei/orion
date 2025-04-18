<script lang="ts">
	import Chat from './chat.svelte';
	import Landing from './landing.svelte';
	import { writable } from 'svelte/store';

	const state = writable<'landing' | 'chat'>('landing');
	const userInput = writable('');
</script>

{#if $state === 'landing'}
	<Landing {state} {userInput} />
{:else}
	<Chat {userInput} />
{/if}
