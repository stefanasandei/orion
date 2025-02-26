<script lang="ts">
	import BrowserFeed from '@/components/browser/browser-feed.svelte';
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Project } from '@repo/db';

	let {
		data
	}: {
		data: {
			user: UserLocals;
			projects: (Project & { notesCount: number; user: { metadata: { name: string } } })[];
		};
	} = $props();
	const { user, projects } = data;
</script>

<DashboardShell fixedScroll={true} pageName={$t('dashboard.browse_content')} {user}>
	<BrowserFeed {projects} />
</DashboardShell>
