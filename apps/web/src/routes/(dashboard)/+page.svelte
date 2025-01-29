<script lang="ts">
	import MarketingShell from '@/components/marketing/shell.svelte';
	import LandingPage from '@/components/marketing/page.svelte';
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import Dashboard from '@/components/dashboard/page.svelte';
	import type { User, UserMetadata } from '@repo/db';

	let { data } = $props();

	const { metadata, user } = data as {
		user: User | null;
		metadata: UserMetadata | null;
	};
</script>

{#if user === null || metadata === null}
	<MarketingShell>
		<LandingPage />
	</MarketingShell>
{:else}
	<DashboardShell pageName="Home" {user} {metadata}>
		<Dashboard {user} {metadata} />
	</DashboardShell>
{/if}
