<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Project } from '@repo/db';
	import { Input } from '../ui/input';
	import Button from '../ui/button/button.svelte';
	import ProjectCard from './project-card.svelte';

	interface Props {
		projects: (Project & { notesCount: number })[];
	}

	const { projects }: Props = $props();
	const mockProject = projects[0];
</script>

<div
	class="mx-auto w-full max-w-sm space-y-12 p-4 md:max-w-lg md:p-8 lg:max-w-2xl xl:max-w-4xl 2xl:max-w-7xl"
>
	<!-- Search Section -->
	<div class="flex w-full flex-col items-center">
		<h1 class="mb-6 text-2xl font-bold">Discover Amazing Projects</h1>
		<div class="flex w-full max-w-sm flex-col gap-4 md:max-w-xl md:flex-row">
			<Input class="md:flex-1" placeholder="Search for projects..." />
			<Button>Search</Button>
		</div>
	</div>

	<!-- Featured Section -->
	<section>
		<h2 class="mb-6 text-xl font-semibold">Featured Projects</h2>
		<div class="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto">
			{#if mockProject}
				{#each Array(6) as _}
					<div class="shrink-0 snap-start p-2">
						<ProjectCard project={mockProject} />
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<!-- Trending Section -->
	<section>
		<h2 class="mb-6 text-xl font-semibold">Trending Now</h2>
		<div class="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto">
			{#if mockProject}
				{#each Array(3) as _}
					<div class="shrink-0 snap-start p-2">
						<ProjectCard project={mockProject} />
					</div>
				{/each}
			{/if}
		</div>
	</section>

	<!-- Recently Added -->
	<section>
		<h2 class="mb-6 text-xl font-semibold">Recently Added</h2>
		<div class="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto">
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
