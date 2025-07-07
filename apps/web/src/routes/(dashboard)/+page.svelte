<script lang="ts">
	import MarketingShell from '@/components/marketing/shell.svelte';
	import LandingPage from '@/components/marketing/page.svelte';
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Note } from '@repo/db';

	import CleanDashboard from '$base/src/lib/components/dashboard/page.svelte';

	let { data: _data }: { data: { user: UserLocals; notes: Note[] } } = $props();
	const { user, notes: _notes } = $derived(_data);
	const notes = $derived(_notes);
</script>

{#if user.session === null}
	<MarketingShell>
		<LandingPage />
	</MarketingShell>
{:else}
	<DashboardShell className="flex flex-col h-full" pageName={$t('dashboard.home')} {user}>
		<CleanDashboard {user} {notes} />
	</DashboardShell>
{/if}
