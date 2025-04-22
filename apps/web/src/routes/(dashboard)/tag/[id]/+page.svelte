<script lang="ts">
	import LinkPreviewCard from '$base/src/lib/components/dashboard/link-preview-card.svelte';
	import ShortProjectCard from '$base/src/lib/components/dashboard/short-project-card.svelte';
	import ShortThoughtCard from '$base/src/lib/components/dashboard/short-thought-card.svelte';
	import Separator from '$base/src/lib/components/ui/separator/separator.svelte';
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Note, Project, Tag } from '@repo/db';
	import { Badge } from '$base/src/lib/components/ui/badge';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$base/src/lib/components/ui/tabs';
	import FileCard from '$base/src/lib/components/dashboard/file-card.svelte';

	type ProjectWithTags = Project & { tags: { tagId: number; tag: { name: string } }[] };

	let {
		data: _data
	}: {
		data: {
			user: UserLocals;
			projects: ProjectWithTags[];
			tag: Tag;
			notes: (Note & { tags: { tagId: number; tag: { name: string } }[] })[];
		};
	} = $props();
	const { user, projects, notes, tag } = $derived(_data);

	const isURL = (text: string): boolean => {
		const urlRegex =
			/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
		return urlRegex.test(text);
	};

	const isNote = (item: Project | Note): item is Note => {
		return 'jsonContent' in item;
	};

	// Compute counts for the badge displays
	const projectCount = $derived(projects.length);
	const thoughtCount = $derived(
		notes.filter((note) => !isURL(note.name) && note.type == 'thought').length
	);
	const linkCount = $derived(notes.filter((note) => isURL(note.name)).length);
	const fileCount = $derived(notes.filter((note) => note.type == 'file').length);
</script>

<DashboardShell pageName={tag.name} {user}>
	<div class="mx-auto flex w-full max-w-4xl flex-col gap-6">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-4">
					<h1 class="text-4xl font-bold">#{tag.name}</h1>
					<Badge variant="outline" class="h-7 px-3 text-base">
						{projectCount + notes.length} items
					</Badge>
				</div>
				<p class="text-muted-foreground">
					Collection of all items tagged with #{tag.name}
				</p>
			</div>

			<Tabs value="all" class="w-full">
				<TabsList class="w-full justify-start">
					<TabsTrigger value="all">
						All
						<Badge variant="secondary" class="ml-2">{projectCount + notes.length}</Badge>
					</TabsTrigger>
					<TabsTrigger value="projects">
						Projects
						<Badge variant="secondary" class="ml-2">{projectCount}</Badge>
					</TabsTrigger>
					<TabsTrigger value="thoughts">
						Thoughts
						<Badge variant="secondary" class="ml-2">{thoughtCount}</Badge>
					</TabsTrigger>
					<TabsTrigger value="links">
						Links
						<Badge variant="secondary" class="ml-2">{linkCount}</Badge>
					</TabsTrigger>
					<TabsTrigger value="files">
						Files
						<Badge variant="secondary" class="ml-2">{fileCount}</Badge>
					</TabsTrigger>
				</TabsList>

				<Separator class="my-4" />

				<TabsContent value="all" class="m-0">
					<div class="grid gap-4">
						{#each [...projects, ...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as item}
							{#if !isNote(item)}
								<ShortProjectCard project={item as ProjectWithTags} />
							{:else if item.type == 'file'}
								<FileCard isPreview={true} thought={item} />
							{:else if isURL((item as Note).name)}
								<LinkPreviewCard thought={item} />
							{:else}
								<ShortThoughtCard thought={item} />
							{/if}
						{/each}
					</div>
				</TabsContent>

				<TabsContent value="projects" class="m-0">
					<div class="grid gap-4">
						{#each projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as project}
							<ShortProjectCard {project} />
						{/each}
					</div>
				</TabsContent>

				<TabsContent value="thoughts" class="m-0">
					<div class="grid gap-4">
						{#each notes
							.filter((note) => !isURL(note.name) && note.type == 'thought')
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as thought}
							<ShortThoughtCard {thought} />
						{/each}
					</div>
				</TabsContent>

				<TabsContent value="links" class="m-0">
					<div class="grid gap-4">
						{#each notes
							.filter((note) => isURL(note.name))
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as link}
							<LinkPreviewCard thought={link} />
						{/each}
					</div>
				</TabsContent>

				<TabsContent value="files" class="m-0">
					<div class="grid gap-4">
						{#each notes
							.filter((note) => note.type == 'file')
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as link}
							<FileCard isPreview={true} thought={link} />
						{/each}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	</div>
</DashboardShell>
