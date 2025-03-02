<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Project } from '@repo/db';
	import { Input } from '../ui/input';
	import ProjectCard from './project-card.svelte';
	import Separator from '../ui/separator/separator.svelte';
	import MiniSearch from 'minisearch';

	interface Props {
		projects: (Project & { notesCount: number; user: { metadata: { name: string } } })[];
	}

	type ProjectWithMeta = Props['projects'][number];
	type DisplayState = 'recent' | 'search';

	const { projects }: Props = $props();

	// search utils
	const miniSearch = new MiniSearch({
		fields: ['name'],
		storeFields: ['name', 'id', 'notesCount', 'user'] as const,
		searchOptions: {
			fuzzy: true
		}
	});

	let query = $state('');
	let displayState = $derived<DisplayState>(query.trim().length == 0 ? 'recent' : 'search');

	let searchResults = $state<ProjectWithMeta[]>([]);

	$effect(() => {
		const trimmedQuery = query.trim();

		const results = miniSearch.search(trimmedQuery, {
			fields: ['name'],
			prefix: true
		});

		searchResults = results.map((result) => {
			const project = projects.find((p) => p.id === result.id);
			if (!project) throw new Error('Project not found');
			return project;
		});
	});

	$effect(() => {
		miniSearch.addAll(
			projects.map((p) => ({
				id: p.id,
				name: p.name,
				notesCount: p.notesCount,
				user: p.user
			}))
		);
	});

	// featured & recent projects
	// TODO: obv. proper stuff
	const FEATURED_PROJECT_NAMES = [
		'Mişcare oscilatorie armonică',
		'Grafuri',
		'Anatomie clasa a 11-a'
	];
	const recentProjects = projects.filter(
		(p) => FEATURED_PROJECT_NAMES.findIndex((v) => v == p.name) == -1
	);
	const featuredProjects = projects.filter(
		(p) => FEATURED_PROJECT_NAMES.findIndex((v) => v == p.name) != -1
	);
</script>

<div
	class="mx-auto w-full max-w-sm space-y-12 p-4 md:max-w-lg md:p-8 lg:max-w-2xl xl:max-w-4xl 2xl:max-w-7xl"
>
	<div class="flex w-full flex-col items-center">
		<h1 class="mb-6 text-2xl font-bold md:text-4xl">{$t('project.browser.title')}</h1>
		<div class="flex w-full max-w-sm flex-col gap-4 md:max-w-xl md:flex-row">
			<Input
				bind:value={query}
				class="md:flex-1"
				placeholder={$t('project.browser.search.placeholder')}
			/>
		</div>
	</div>

	{#if displayState === 'recent'}
		<section>
			<h2 class="mb-2 text-xl font-semibold md:text-3xl">
				{$t('project.browser.sections.featured')}
			</h2>
			<Separator class="mb-2" />
			<div class="scrollbar-none -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto">
				{#each featuredProjects as project}
					<div class="shrink-0 snap-start p-2">
						<ProjectCard {project} />
					</div>
				{/each}
			</div>
		</section>

		<section>
			<h2 class="mb-2 text-xl font-semibold md:text-3xl">
				{$t('project.browser.sections.recent')}
			</h2>
			<Separator class="mb-2" />
			<div class="scrollbar-none -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto">
				{#each recentProjects as project}
					<div class="shrink-0 snap-start p-2">
						<ProjectCard {project} />
					</div>
				{/each}
			</div>
		</section>
	{:else}
		<section>
			<h2 class="mb-2 text-xl font-semibold md:text-3xl">
				{$t('project.browser.sections.search_results')}
			</h2>
			<Separator class="mb-2" />
			<div class="scrollbar-none -mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto">
				{#each searchResults as project}
					<div class="shrink-0 snap-start p-2">
						<ProjectCard {project} />
					</div>
				{/each}
			</div>
			{#if searchResults.length === 0}
				<p class="text-muted-foreground text-center">{$t('project.browser.no_results')}</p>
			{/if}
		</section>
	{/if}
</div>
