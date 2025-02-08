<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';

	let { data }: { data: { user: UserLocals } } = $props();
	const { user } = data;
</script>

<DashboardShell pageName={$t('dashboard.browse_content')} {user}>
	<p>{$t('dashboard.browse_content')}</p>
</DashboardShell>
