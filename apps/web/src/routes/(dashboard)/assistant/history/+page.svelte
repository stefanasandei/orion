<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import AssistantHistoryPage from '@/components/assistant/history-page.svelte';

	let { data }: { data: { user: UserLocals; conversations: { id: string; name?: string }[] } } =
		$props();
	const { user, conversations } = data;
</script>

<DashboardShell className="flex flex-col h-full" pageName={$t('dashboard.assistant')} {user}>
	<AssistantHistoryPage userId={user.session?.userId!} {conversations} />
</DashboardShell>
