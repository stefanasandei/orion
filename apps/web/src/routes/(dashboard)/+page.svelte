<script lang="ts">
	import MarketingShell from '@/components/marketing/shell.svelte';
	import LandingPage from '@/components/marketing/page.svelte';
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import Dashboard from '@/components/dashboard/page.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	
	let { data }: { data: { user: UserLocals } } = $props();
	const { user } = data;

	if (user.user !== null && browser) {
		if (user.user.workspaces.length === 0) {
			goto('/create-workspace');
		}
	}
</script>

{#if user.session === null}
	<MarketingShell>
		<LandingPage />
	</MarketingShell>
{:else}
	<DashboardShell pageName={$t('dashboard.home')} {user}>
		<Dashboard {user} />
	</DashboardShell>
{/if}
