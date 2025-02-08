<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';

	interface Props {
		user: UserLocals;
	}

	const { user }: Props = $props();
	const { metadata } = user.user!;
</script>

<p>{$t('dashboard.hello')}, {metadata.name}!</p>
