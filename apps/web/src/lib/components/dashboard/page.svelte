<script lang="ts">
	import type { User, UserMetadata } from '@repo/db';
	import { t } from '@/utils/i18n/translations';

	interface Props {
		user: User;
		metadata: UserMetadata;
	}

	const { metadata }: Props = $props();
</script>

<p>{$t('dashboard.hello')}, {metadata.name}!</p>
