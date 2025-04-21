<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';

	let {
		data: _data
	}: {
		data: {
			user: UserLocals;
			tagId: number;
		};
	} = $props();
	const { user, tagId } = $derived(_data);
</script>

<DashboardShell pageName={'Tag'} {user}>
	<div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
		todo: {tagId}

		<!-- query all documents with that tag -->
	</div>
</DashboardShell>
