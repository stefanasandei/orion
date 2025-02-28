<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import AssistantPage from '@/components/assistant/page.svelte';

	let { data }: { data: { user: UserLocals } } = $props();
	const { user } = data;
</script>

<DashboardShell fixedScroll={true} pageName={$t('dashboard.assistant')} {user}>
	<AssistantPage />
</DashboardShell>
