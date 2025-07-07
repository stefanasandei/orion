<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';

	let { data }: { data: { user: UserLocals } } = $props();
	const { user } = data;
</script>

<DashboardShell pageName={$t('dashboard.notifications')} {user}>
	<CategoryShell
		title={$t('dashboard.notifications')}
		description={$t('dashboard.notifications_desc')}
	>
		<div class="flex w-full items-center justify-center md:h-[65svh]">
			<p>{$t('dashboard.notifications_body')}</p>
		</div>
	</CategoryShell>
</DashboardShell>
