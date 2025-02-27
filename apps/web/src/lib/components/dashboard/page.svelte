<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import ActivityGrid from './activity-grid.svelte';
	import Toolbar from './toolbar.svelte';

	interface Props {
		user: UserLocals;
	}

	const { user }: Props = $props();
	const { metadata } = user.user!;
</script>

<div class="flex h-full flex-col gap-4">
	<Toolbar />

	<div class="grid h-full md:grid-cols-3 lg:grid-cols-4">
		<div class="mx-4 h-full pt-4 md:col-span-2 lg:col-span-3">
			<p class="text-3xl md:text-2xl">{$t('dashboard.hello')}, {metadata.name}!</p>
		</div>

		<ActivityGrid />
	</div>
</div>
