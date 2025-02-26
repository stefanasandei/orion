<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project, Tag } from '@repo/db';
	import Button, { buttonVariants } from '@/components/ui/button/button.svelte';
	import { Badge } from '@/components/ui/badge';
	import { toast } from 'svelte-sonner';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';
	import AddTag from './add-tag.svelte';
	import ProjectInfoPills from './project-info-pills.svelte';

	interface Props {
		isPublicView?: boolean;
		project: Project & { notes: Note[]; tags: Tag[] };
	}

	const { project, isPublicView = false }: Props = $props();
</script>

<div class="border-border md:border-background -mx-2 border-b-2 md:px-2">
	<div
		class="md:bg-muted/40 grid h-full grid-rows-4 items-center gap-6 rounded-lg px-3 pb-3 md:mx-auto md:max-w-5xl md:py-3"
	>
		<!-- type info pill & share button row -->
		<div class="row-span-1 mb-3 flex flex-row items-center justify-between">
			<div class="flex flex-row gap-2">
				<Badge variant="secondary">{$t('project.overview.project_type')}</Badge>
				{#if isPublicView}
					<Badge variant="secondary">Public</Badge>
				{/if}
			</div>

			{#if project.isPublic}
				<Button
					variant={'outline'}
					size="sm"
					onclick={() => {
						const publicUrl = `${PUBLIC_WEBSITE_URL}/browse/project/${project.id}`;
						navigator.clipboard.writeText(publicUrl).then(() => {
							toast.success($t('project.overview.copied'));
						});
					}}>{$t('project.overview.share')}</Button
				>
			{/if}
		</div>

		<!-- project title & some brief info -->
		<div class="row-span-2">
			<p class="mt-2 text-4xl">{project.name}</p>

			<ProjectInfoPills {project} notesCount={project.notes.length} />
		</div>

		<!-- tags & edit buttons -->
		<div class="row-span-1 flex h-fit flex-row justify-between">
			<div class="flex flex-row items-center gap-1">
				{#each project.tags as tag}
					<Badge variant={'secondary'}>{tag.name}</Badge>
				{/each}

				{#if !isPublicView}
					<AddTag {project} />
				{/if}
			</div>

			{#if !isPublicView}
				<a
					href={`/projects/edit/${project.id}`}
					class={buttonVariants({ variant: 'outline', size: 'sm' })}
					>{$t('project.overview.edit')}</a
				>
			{/if}
		</div>
	</div>
</div>
