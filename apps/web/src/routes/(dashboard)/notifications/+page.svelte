<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';

	let { data }: { data: { user: UserLocals } } = $props();
	const { user } = data;
</script>

<DashboardShell pageName={$t('dashboard.notifications')} {user}>
	<p>{$t('dashboard.notifications')}</p>
</DashboardShell>
