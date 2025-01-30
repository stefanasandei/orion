<script lang="ts">
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import AccountForm from '@/components/settings/account-form.svelte';
	import type { PageData } from './$types.js';

	let { data }: { data: PageData } = $props();
</script>

<CategoryShell title="Account " description="This is how others will see you on the site.">
	<AccountForm {data} />
</CategoryShell>
