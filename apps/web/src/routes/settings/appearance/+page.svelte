<script lang="ts">
	import CategoryShell from '@/components/settings/category-shell.svelte';
	import * as Select from '@/components/ui/select';
	import { Label } from '@/components/ui/label';
	import { preferences } from '@/utils/stores';
	import { setTheme, setDashboardLayout } from '@/utils/settings';
	import type { Theme } from '@/utils/settings';
	import { t } from '@/utils/i18n/translations';
	import { Switch } from '@/components/ui/switch';
	import Button from '$base/src/lib/components/ui/button/button.svelte';
	import { Input } from '$base/src/lib/components/ui/input';
	import { Moon, Plus, Sun, X } from 'lucide-svelte';
	import type { Tag } from '@repo/db';
	import TagComponent from '$base/src/lib/components/dashboard/tag.svelte';
	import { trpc } from '$base/src/lib/utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	const { data }: { data: { tags: Tag[] } } = $props();

	let theme = $state<'Light' | 'Dark'>($preferences.theme === 'light' ? 'Light' : 'Dark');
	let useActivityGrid = $state($preferences.dashboard === 'activity-grid');
	let useRichTextEditor = $state($preferences.useRichTextEditor ?? true);

	let newTagName = $state('');
	const addTag = trpc().user.addTag.createMutation({
		onSuccess: async () => {
			toast.success($t('dashboard.tag_added'));
			await invalidateAll();
		}
	});
	const removeTag = trpc().user.removeTag.createMutation({
		onSuccess: async () => {
			toast.success($t('dashboard.tag_deleted'));
			await invalidateAll();
		}
	});

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

<CategoryShell title={$t('settings.appearance')} description={$t('settings.appearance_text')}>
	<div class="space-y-8">
		<!-- Theme Section -->
		<section class="rounded-lg border-2 p-6">
			<h2 class="mb-6 text-2xl font-semibold tracking-tight">{$t('settings.preferences')}</h2>

			<div class="grid gap-6">
				<!-- Theme Selector -->
				<div class="bg-muted/25 relative overflow-hidden rounded-lg border p-6 transition-all">
					<div class="flex items-center justify-between">
						<div class="space-y-1">
							<Label class="text-lg">{$t('settings.color_theme')}</Label>
							<p class="text-muted-foreground">{$t('settings.color_theme_text')}</p>
						</div>
						<Select.Root bind:value={theme} type="single">
							<Select.Trigger class="w-fit">
								<div class="flex items-center gap-2">
									{#if theme === 'Light'}
										<Sun class="size-4" />
									{:else}
										<Moon class="size-4" />
									{/if}
									{theme === 'Light' ? $t('settings.color_light') : $t('settings.color_dark')}
								</div>
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="Light">
									<div class="flex items-center gap-2">
										<Sun class="size-4" />

										{$t('settings.color_light')}
									</div>
								</Select.Item>
								<Select.Item value="Dark">
									<div class="flex items-center gap-2">
										<Moon class="size-4" />

										{$t('settings.color_dark')}
									</div>
								</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>

				<!-- Layout Toggle -->
				<div class="bg-muted/25 relative overflow-hidden rounded-lg border p-6 transition-all">
					<div class="flex items-center justify-between">
						<div class="space-y-1">
							<Label class="text-lg">{$t('settings.dashboard_layout')}</Label>
							<p class="text-muted-foreground">{$t('settings.dashboard_layout_text')}</p>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-muted-foreground text-sm"
								>{useActivityGrid
									? $t('settings.activity_grid')
									: $t('settings.clean_layout')}</span
							>
							<Switch bind:checked={useActivityGrid} />
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Tags Section -->
		<section class="rounded-lg border-2 p-6">
			<h2 class="mb-6 text-2xl font-semibold tracking-tight">{$t('settings.tag_management')}</h2>

			<!-- Add Tag -->
			<div class="mb-6 space-y-4">
				<div class="flex items-center gap-4">
					<Input
						bind:value={newTagName}
						placeholder={$t('settings.enter_tag_name')}
						class="max-w-xs"
					/>
					<Button
						onclick={() => {
							if (newTagName.trim().length == 0) return;
							$addTag.mutate({ name: newTagName });
						}}
						variant="outline"
						class="gap-2"
					>
						<Plus class="size-4" />
						{$t('settings.add_tag')}
					</Button>
				</div>
			</div>

			<!-- Tags Grid -->
			<div class="space-y-2">
				<Label class="text-lg">{$t('settings.your_tags')}</Label>
				<div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
					{#each data.tags as tag}
						<div
							class="group flex items-center gap-2 rounded-lg border p-2 transition-all hover:shadow-sm"
						>
							<TagComponent name={tag.name} id={tag.id} />
							<button
								class="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
								onclick={() => {
									$removeTag.mutate({ id: tag.id });
								}}
							>
								<X class="text-muted-foreground hover:text-destructive size-4 transition-colors" />
							</button>
						</div>
					{/each}
				</div>
			</div>
		</section>
	</div>
</CategoryShell>
