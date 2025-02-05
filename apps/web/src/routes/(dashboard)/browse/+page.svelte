<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { User, UserMetadata } from '@repo/db';
	import { t } from '@/utils/i18n/translations';

	let { data } = $props();

	const { metadata, user } = data as {
		user: User;
		metadata: UserMetadata;
	};
</script>

<DashboardShell pageName={$t('dashboard.browse_content')} {user} {metadata}>
	<p>{$t('dashboard.browse_content')}</p>
</DashboardShell>
