<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import type { Snippet } from 'svelte';
	import type { PageProps } from './$types';
	import { t } from '@/utils/i18n/translations';

	interface Props {
		children: Snippet;
	}

	const { children, data }: Props & PageProps = $props();
	const { metadata, user } = data;
</script>

<DashboardShell pageName={$t('settings.settings')} {user} {metadata}>
	{@render children?.()}
</DashboardShell>
