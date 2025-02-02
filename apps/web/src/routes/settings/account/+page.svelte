<script lang="ts">
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import AccountForm from '@/components/settings/account-form.svelte';
	import type { PageData } from './$types.js';
	import { t } from '@/utils/i18n/translations';

	let { data }: { data: PageData } = $props();
</script>

<CategoryShell title={$t('settings.account')} description={$t('settings.account_desc')}>
	<AccountForm {data} />
</CategoryShell>
