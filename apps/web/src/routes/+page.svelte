<script lang="ts">
	import { t } from '@/utils/i18n/translations';

	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';

	let result = '';
	const processName = trpc().hello.processName.createMutation({
		onSuccess: (res) => {
			result = JSON.stringify(res);
		}
	});

	// prefetched server data
	export let data;
</script>

<h1>Welcome to SvelteKit: {data.hello?.message}</h1>
<p>user: {JSON.stringify(data.user)}</p>
<p>{$t('common.mutation')}: {result}</p>

<Button
	onclick={async () => {
		$processName.mutate({ name: 'Stefan ' + Date.now().toString() });
	}}>click for mutation</Button
>
