<script lang="ts">
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import { setTheme, setDashboardLayout } from '@/utils/settings';
	import type { Theme } from '@/utils/settings';
	import { t } from '@/utils/i18n/translations';
	import UsageDashboard from '$base/src/lib/components/settings/usage-dashboard.svelte';
	import type { Usage } from '@repo/db';

	const { data }: { data: { usage: Usage[] } } = $props();
</script>

<CategoryShell title="Usage" description="How much resources you have used on our platform.">
	<UsageDashboard usage={data.usage} />
</CategoryShell>
