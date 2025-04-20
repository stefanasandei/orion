<script lang="ts">
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import * as Select from '@/components/ui/select';
	import { Label } from '@/components/ui/label';
	import { preferences } from '@/utils/stores';
	import { setTheme, setDashboardLayout } from '@/utils/settings';
	import type { Theme } from '@/utils/settings';
	import { t } from '@/utils/i18n/translations';
	import { Switch } from '@/components/ui/switch';

	let theme = $state<'Light' | 'Dark'>($preferences.theme === 'light' ? 'Light' : 'Dark');
	let useActivityGrid = $state($preferences.dashboard === 'activity-grid');

	$effect(() => {
		setTheme(theme.toLowerCase() as Theme);
	});

	$effect(() => {
		setDashboardLayout(useActivityGrid ? 'activity-grid' : 'clean');
	});
</script>

<CategoryShell title="Usage" description="How much resources you have used on our platform.">
	<p>todo...</p>
</CategoryShell>
