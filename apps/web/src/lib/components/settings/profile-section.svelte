<script lang="ts">
	import type { Project, UserMetadata } from '@repo/db';
	import { t } from '@/utils/i18n/translations';
	import { Separator } from '$base/src/lib/components/ui/sidebar';
	import { Badge } from '$base/src/lib/components/ui/badge/index.js';
	import ProjectCard from '../browser/project-card.svelte';
	import { Button } from '../ui/button';
	import { toast } from 'svelte-sonner';
	import { PUBLIC_WEBSITE_URL } from '$env/static/public';

	interface Props {
		isOwn?: boolean;
		user: {
			metadata: UserMetadata;
			projects: Array<Project & { user: { metadata: { name: string } } }>;
		};
	}

	const { user, isOwn = false }: Props = $props();
</script>

<div class="mx-auto w-full space-y-6 md:max-w-[60%]">
	<div>
		<div class="mb-3 flex flex-row items-center justify-between">
			<h3 class="text-4xl font-medium">{user.metadata.name}</h3>
			<div class="flex flex-row items-center gap-2">
				<Badge variant="secondary">{$t('dashboard.profile.badge')}</Badge>
				{#if isOwn}
					<Button
						variant={'outline'}
						size="sm"
						onclick={() => {
							const publicUrl = `${PUBLIC_WEBSITE_URL}/profile/${user.metadata.name}`;
							navigator.clipboard.writeText(publicUrl).then(() => {
								toast.success($t('project.overview.copied'));
							});
						}}>{$t('project.overview.share')}</Button
					>
				{/if}
			</div>
		</div>

		<p class="text-muted-foreground text-md">
			<span class="text-muted-foreground/85">{$t('dashboard.profile.description')}</span>
			{user.metadata.bio}
		</p>

		<p class="my-4">
			{$t('dashboard.profile.projects_created', { default: user.projects.length })}
		</p>
		<Separator class="-mx-2 mb-3" />
	</div>

	<div class="flex flex-col gap-4">
		<div>
			<h2 class="mb-1 text-2xl font-semibold">{$t('dashboard.profile.published_projects')}</h2>

			<div class="flex w-full flex-col gap-4">
				{#each user.projects as project}
					<div class="shrink-0 snap-start py-2">
						<ProjectCard large={true} {project} />
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
