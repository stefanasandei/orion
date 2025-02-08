<script lang="ts">
	import MarketingShell from '@/components/marketing/shell.svelte';
	import LandingPage from '@/components/marketing/page.svelte';
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import Dashboard from '@/components/dashboard/page.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';

	let { data }: { data: { user: UserLocals } } = $props();
	const { user } = data;
</script>

{#if user === null}
	<MarketingShell>
		<LandingPage />
	</MarketingShell>
{:else}
	<DashboardShell pageName={$t('dashboard.home')} {user}>
		<Dashboard {user} />
	</DashboardShell>
{/if}
