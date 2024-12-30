<script lang="ts">
	import { MyCounterButton } from '@repo/ui';
	import { trpc } from '$lib/trpc/client';

	let result = '';
	const processName = trpc().hello.processName.createMutation({
		onSuccess: (res) => {
			result = res.message;
		}
	});

	// prefetched server data
	export let data;
</script>

<h1>Welcome to SvelteKit: {data.hello?.message}</h1>

<p>result of mutation: {result}</p>
<MyCounterButton />

<button
	onclick={async () => {
		$processName.mutate({ name: 'Stefan' });
	}}>click for mutation</button
>
