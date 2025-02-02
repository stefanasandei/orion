<script lang="ts">
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import * as Select from '@/components/ui/select';
	import { Label } from '@/components/ui/label';
	import { preferences } from '@/utils/stores';
	import { t } from '@/utils/i18n/translations';

	function setTheme(theme: 'light' | 'dark') {
		preferences.update((prefs) => ({ ...prefs, theme }));
	}

	let theme = $state<'Light' | 'Dark'>($preferences.theme == 'light' ? 'Light' : 'Dark');

	$effect(() => setTheme(theme.toLowerCase() as 'light' | 'dark'));
</script>

<CategoryShell title="Appearance" description="This is how others will see you on the site.">
	<h2 class="mb-3 text-xl font-bold">{$t('settings.preferences')}</h2>
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
			<div>
				<div class="mb-2 flex flex-row items-center gap-3">
					<Label>{$t('settings.color_theme')}</Label>
				</div>
				<Select.Root bind:value={theme} type="single">
					<Select.Trigger class="w-[180px]"
						>{theme == 'Light'
							? $t('settings.color_light')
							: $t('settings.color_dark')}</Select.Trigger
					>
					<Select.Content>
						<Select.Item value="Light">{$t('settings.color_light')}</Select.Item>
						<Select.Item value="Dark">{$t('settings.color_dark')}</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</div>
</CategoryShell>
