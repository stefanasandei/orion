<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import Button from '@/components/ui/button/button.svelte';
	import { Badge } from '@/components/ui/badge';
	import { Icons } from '../icons.svelte';
	import OverviewHeader from './overview-header.svelte';
	import ProjectFiletree from './project-filetree.svelte';

	interface Props {
		project: Project & { notes: Note[] };
	}

	const { project }: Props = $props();
</script>

<OverviewHeader {project} />

<div class="mt-4 flex flex-col gap-6 md:mx-auto md:max-w-5xl">
	{#if project.description !== null && project.description.length}
		<div>
			<p class="mb-2 text-2xl">Description</p>
			<p>{project.description}</p>
		</div>
	{/if}

	<div>
		<div class="flex flex-row items-center justify-between">
			<p class="text-2xl">Documents</p>
			<Button class="ml-3" size={'small-icon'} variant={'secondary'}><Icons.add /></Button>
		</div>
		<ProjectFiletree {project} />
	</div>
</div>
