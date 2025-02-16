<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import Button from '@/components/ui/button/button.svelte';
	import { Badge } from '@/components/ui/badge';
	import { Clock, Book } from 'lucide-svelte';
	import { Icons } from '../icons.svelte';

	interface Props {
		project: Project & { notes: Note[] };
	}

	const { project }: Props = $props();

	const createdAtDate = $derived(
		(() => {
			const day = project.createdAt.getDate();
			const month = project.createdAt.toLocaleString('default', { month: 'long' });
			const year = project.createdAt.getFullYear();

			// quicker than researching some library
			return `${day} ${month} ${year}`;
		})()
	);
</script>

<div class="border-border md:border-background -mx-2 border-b-2 md:px-2">
	<div
		class="md:bg-muted/40 grid h-full grid-rows-4 items-end gap-6 rounded-lg px-3 pb-3 md:mx-auto md:max-w-5xl md:py-3"
	>
		<!-- type info pill & share button row -->
		<div class="row-span-1 mb-3 flex flex-row items-center justify-between">
			<Badge variant="secondary">Project</Badge>
			<Button variant={'outline'} size="sm">Share</Button>
		</div>

		<!-- project title & some brief info -->
		<div class="row-span-2">
			<p class="mt-2 text-4xl">{project.name}</p>
			<p class="mt-2 text-xl">
				<!-- <span class="text-foreground/80">Description:{' '}</span> -->
				{project.description}
			</p>

			<div class="text-foreground/80 mt-2 flex flex-col gap-2 md:flex-row md:gap-6">
				<div class="flex flex-row items-center gap-1">
					<Clock class="size-5" />
					<p>Created {createdAtDate}</p>
				</div>

				<div class="flex flex-row items-center gap-1">
					<Book class="size-5" />
					<p>{project.notes.length} document{project.notes.length == 1 ? '' : 's'}</p>
				</div>
			</div>
		</div>

		<!-- tags & edit buttons -->
		<div class="row-span-1 flex h-fit flex-row justify-between">
			<div class="flex flex-row items-center gap-1">
				<Badge variant={'secondary'}>tags</Badge>
				<Badge variant={'secondary'}>will</Badge>
				<Badge variant={'secondary'}>go</Badge>
				<Badge variant={'secondary'}>here</Badge>

				<Button class="ml-3" size={'small-icon'} variant={'outline'}><Icons.add /></Button>
			</div>

			<Button variant={'outline'} size="sm">Edit</Button>
		</div>
	</div>
</div>
