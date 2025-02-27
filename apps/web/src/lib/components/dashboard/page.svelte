<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import ActivityGrid from './activity-grid.svelte';
	import Toolbar from './toolbar.svelte';
	import type { Note } from '@repo/db';

	interface Props {
		user: UserLocals;
		notes: Note[];
	}

	const { user, notes: _notes }: Props = $props();
	const { metadata } = user.user!;
	const notes = $derived(_notes);
</script>

<div class="flex h-full flex-col gap-4">
	<Toolbar />

	<div class="grid h-full md:grid-cols-3 lg:grid-cols-4">
		<div class="mx-4 h-full pt-4 md:col-span-2 lg:col-span-3">
			<p class="text-3xl md:text-2xl">{$t('dashboard.hello')}, {metadata.name}!</p>
		</div>

		<ActivityGrid {notes} />
	</div>
</div>
