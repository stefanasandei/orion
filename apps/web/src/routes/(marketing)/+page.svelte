<script lang="ts">
	import { goto } from '$app/navigation';
	import { buttonVariants } from '@/components/ui/button';
	import { trpc } from '@/utils/trpc/client';

	const logout = trpc().user.logout.createMutation({
		onSuccess: () => {
			goto('/', { invalidateAll: true });
		}
	});

	// prefetched server data
	export let data;
</script>

<p>user: {JSON.stringify(data.metadata)}</p>

{#if data.user === null}
	<a href="/register" class={buttonVariants()}>register</a>
	<a href="/login" class={buttonVariants()}>login</a>
{:else}
	<button onclick={() => $logout.mutate()} class={buttonVariants()}>logout</button>
{/if}
