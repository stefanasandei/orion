<script lang="ts">
	import type { Project, Tag } from '@repo/db';
	import { Icons } from '../icons.svelte';
	import { Button } from '../ui/button';
	import ResponsiveDialog from '../responsive-dialog.svelte';
	import { Input } from '../ui/input';
	import LoadingSpinner from '../loading-spinner.svelte';
	import { trpc } from '../../utils/trpc/client';
	import { Separator } from '../ui/separator';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { t } from '../../utils/i18n/translations';

	// props
	interface Props {
		project: Project & { tags: Tag[] };
	}

	const { project }: Props = $props();

	// queries & mutations
	const allTags = trpc().tag.getFromUser.createQuery();

	const createTag = trpc().tag.create.createMutation({
		onSuccess: () => {
			tagName = '';
			$allTags.refetch();
		}
	});

	const addTagToProject = trpc().tag.addToEntity.createMutation({
		onSuccess: async (value) => {
			toast($t('project.added_tag', { default: value[0]!.name }));

			// roll back the state to default
			selectedTag = null;
			tagName = '';

			open = false;
			await invalidateAll();
		}
	});

	// state
	let open = $state(false);
	let selectedTag = $state<number | null>(null);
	let tagName = $state('');
	let tagsCount = $derived(
		(() => {
			if ($allTags.isLoading) return 0;

			return $allTags.data?.filter((t) => {
				for (let i = 0; i < project.tags.length; i++) if (project.tags[i].id == t.id) return false;
				return true;
			}).length;
		})()
	);
</script>

<ResponsiveDialog class="" title={$t('project.add_tag')} description={''} bind:open>
	{#snippet triggerButton()}
		<Button class="ml-0" size={'small-icon'} variant={'outline'}><Icons.add /></Button>
	{/snippet}

	<div class="flex h-full flex-col justify-between">
		<div class="h-full">
			<div class="flex flex-row gap-2">
				<Input bind:value={tagName} placeholder={$t('project.create_tag')} />
				<Button
					onclick={() => {
						$createTag.mutate({
							name: tagName
						});
					}}>{$t('project.create')}</Button
				>
			</div>

			{#if !$allTags.isLoading}
				<p class="mt-4">{tagsCount} {tagsCount == 1 ? $t('project.tag') : $t('project.tags')}</p>
				<Separator class="mt-4" />
				{#if tagsCount != 0}
					<div class="flex flex-col gap-2">
						{#each $allTags.data ?? [] as tag}
							{#if project.tags.filter((t) => t.id == tag.id).length == 0}
								<Button
									variant={selectedTag == tag.id ? 'default' : 'secondary'}
									onclick={() => (selectedTag = tag.id)}
									size="sm"
									class="w-fit">{tag.name}</Button
								>
							{/if}
						{/each}
					</div>
				{:else}
					<div class="flex h-full w-full items-center justify-center">
						<p>{$t('project.no_tags')}</p>
					</div>
				{/if}
			{:else}
				<div class="h-full w-full">
					<LoadingSpinner />
				</div>
			{/if}
		</div>

		<Button
			class="w-full"
			disabled={selectedTag == null}
			onclick={() => {
				$addTagToProject.mutate({
					tagId: selectedTag!,
					projectId: project.id
				});
			}}>{$t('project.add')}</Button
		>
	</div></ResponsiveDialog
>
