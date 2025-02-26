<script lang="ts">
	import type { Note, Project } from '@repo/db';
	import type { NoteTreeNode } from '@repo/api/services';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { type ComponentProps } from 'svelte';
	import FileTree from './filetree.svelte';
	import { page } from '$app/state';

	interface Props {
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
	}

	let {
		ref = $bindable(null),
		project,
		noteTree,
		...restProps
	}: Props & ComponentProps<typeof Sidebar.Root> = $props();
</script>

<div class="hidden md:flex">
	<Sidebar.Root
		class="bg-muted sticky top-0 hidden h-svh border-l py-2 pr-2 lg:flex"
		collapsible={'icon'}
		isRight={true}
		bind:ref
		{...restProps}
	>
		<Sidebar.Header class="bg-muted p-0"></Sidebar.Header>
		<Sidebar.Content class="bg-muted h-full p-0">
			<!-- <ProjectFiletree {project} {noteTree} /> -->
			<div class="bg-background h-full rounded-lg p-2">
				<FileTree
					isPublicView={page.url.pathname.includes('browse')}
					{noteTree}
					{project}
					sidebar={true}
				/>
			</div>
		</Sidebar.Content>
		<Sidebar.Rail />
	</Sidebar.Root>
</div>
