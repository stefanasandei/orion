<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Project } from '@repo/db';
	import { Input } from '../ui/input';
	import Button from '../ui/button/button.svelte';
	import ProjectCard from './project-card.svelte';
	import Separator from '../ui/separator/separator.svelte';

	interface Props {
		projects: (Project & { notesCount: number; user: { metadata: { name: string } } })[];
	}

	const { projects }: Props = $props();
	// TODO
	const mockProject = projects[0];
</script>

<div
	class="mx-auto w-full max-w-sm space-y-12 p-4 md:max-w-lg md:p-8 lg:max-w-2xl xl:max-w-4xl 2xl:max-w-7xl"
>
	<div class="flex w-full flex-col items-center">
		<h1 class="mb-6 text-2xl font-bold md:text-4xl">Discover new projects</h1>
		<div class="flex w-full max-w-sm flex-col gap-4 md:max-w-xl md:flex-row">
			<Input class="md:flex-1" placeholder="Search for projects..." />
			<Button>Search</Button>
		</div>
	</div>

	<section>
		<h2 class="mb-2 text-xl font-semibold md:text-3xl">Featured projects</h2>
		<Separator class="mb-2" />
		<div class="scrollbar-none -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto">
			{#if mockProject}
				{#each Array(6) as _}
					<div class="shrink-0 snap-start p-2">
						<ProjectCard project={mockProject} />
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<section>
		<h2 class="mb-2 text-xl font-semibold md:text-3xl">Trending now</h2>
		<Separator class="mb-2" />
		<div class="scrollbar-none -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto">
			{#if mockProject}
				{#each Array(3) as _}
					<div class="shrink-0 snap-start p-2">
						<ProjectCard project={mockProject} />
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<section>
		<h2 class="mb-2 text-xl font-semibold md:text-3xl">Recently published</h2>
		<Separator class="mb-2" />
		<div class="scrollbar-none -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto">
			{#if mockProject}
				{#each Array(2) as _}
					<div class="shrink-0 snap-start p-2">
						<ProjectCard project={mockProject} />
					</div>
				{/each}
			{/if}
		</div>
	</section>
</div>
