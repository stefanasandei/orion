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
	let useRichTextEditor = $state($preferences.useRichTextEditor ?? true);

	$effect(() => {
		setTheme(theme.toLowerCase() as Theme);
	});

	$effect(() => {
		setDashboardLayout(useActivityGrid ? 'activity-grid' : 'clean');
	});

	$effect(() => {
		preferences.update((prefs) => ({ ...prefs, useRichTextEditor: useRichTextEditor }));
	});
</script>

<CategoryShell title="Appearance" description="This is how others will see you on the site.">
	<h2 class="mb-3 text-xl font-bold">{$t('settings.preferences')}</h2>

	<div class="flex flex-col gap-6">
		<div class="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
			<div class="space-y-0.5">
				<Label>{$t('settings.color_theme')}</Label>
				<p class="text-muted-foreground text-sm">
					{'Change the main colors of the app interface.'}
				</p>
			</div>
			<Select.Root bind:value={theme} type="single">
				<Select.Trigger class="w-[180px]">
					{theme === 'Light' ? $t('settings.color_light') : $t('settings.color_dark')}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="Light">{$t('settings.color_light')}</Select.Item>
					<Select.Item value="Dark">{$t('settings.color_dark')}</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
			<div class="space-y-0.5">
				<Label>{'Home page layout'}</Label>
				<p class="text-muted-foreground text-sm">
					{'Do you want to use the activity grid dashboard layout?'}
				</p>
			</div>
			<Switch bind:checked={useActivityGrid} />
		</div>

		<!-- <div class="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
			<div class="space-y-0.5">
				<Label>{'Use rich text editor'}</Label>
				<p class="text-muted-foreground text-sm">
					{'You can choose to write Markdown code instead.'}
				</p>
			</div>
			<Switch bind:checked={useRichTextEditor} />
		</div> -->
	</div>
</CategoryShell>
