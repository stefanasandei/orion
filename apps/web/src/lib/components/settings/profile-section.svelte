<script lang="ts">
	import type { Project, UserMetadata } from '@repo/db';
	import { t } from '@/utils/i18n/translations';
	import { Separator } from '$base/src/lib/components/ui/sidebar';
	import { Badge } from '$base/src/lib/components/ui/badge/index.js';
	import ProjectCard from '../browser/project-card.svelte';

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
				<Badge variant="secondary">Public profile</Badge>
				{#if isOwn}
					<Badge variant="secondary"><a href={`/profile/${user.metadata.name}`}>Link </a></Badge>
				{/if}
			</div>
		</div>

		<p class="text-muted-foreground text-md">
			<span class="text-muted-foreground/85">Description: </span>
			{user.metadata.bio}
		</p>

		<p class="my-4">Created {user.projects.length} projects</p>
		<Separator class="-mx-2 mb-3" />
	</div>

	<div class="flex flex-col gap-4">
		<div>
			<h2 class="mb-1 text-2xl font-semibold">Published projects</h2>

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
