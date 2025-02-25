<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Project } from '@repo/db';

	let { data }: { data: { user: UserLocals; projects: Project[] } } = $props();
	const { user, projects } = data;
</script>

<DashboardShell pageName={$t('dashboard.browse_content')} {user}>
	<p>{$t('dashboard.browse_content')}:</p>

	<div class="mt-3 flex flex-col gap-2">
		{#each projects as project}
			<a href={`/browse/project/${project.id}`} class="hover:cursor-pointer hover:underline"
				>{project.name}</a
			>
		{/each}
	</div>
</DashboardShell>
