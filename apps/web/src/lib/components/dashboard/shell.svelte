<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import { Separator } from '@/components/ui/separator';
	import type { Snippet } from 'svelte';
	import Seo from '../seo.svelte';
	import { page } from '$app/state';
	import type { UserLocals } from '@repo/core';
	import { goto } from '$app/navigation';
	import { activeWorkspaceId, initializeActiveWorkspace } from '@/utils/state';
	import { onMount } from 'svelte';
	import NoteSidebar from '../project/note-sidebar.svelte';
	import type { Note, Project } from '@repo/db';
	import type { NoteTreeNode } from '@repo/api/services';

	interface Props {
		pageName: string;
		user: UserLocals;
		fixedScroll?: boolean;
		activeProject?: {
			project: Project & { notes: Note[] };
			noteTree: NoteTreeNode[];
		} | null;
		children: Snippet;
	}

	const {
		pageName,
		user: _user,
		children,
		activeProject: _activeProject = null,
		fixedScroll = false
	}: Props = $props();
	const user = _user.user!;

	const pathname = $derived(page.url.pathname);
	const activeProject = $derived(_activeProject);

	onMount(() => {
		// Initialize active workspace if needed
		initializeActiveWorkspace(user.workspaces);

		// Only redirect if there are no workspaces
		if (user.workspaces.length === 0) {
			goto('/create-workspace');
		}
	});
</script>

<Seo title={pageName} description="" />

{#if activeWorkspaceId.current != -1}
	<Sidebar.Provider class="overflow-hidden">
		<!-- projects + general route navigation -->
		<AppSidebar
			user={{ name: user.metadata.name, email: user.metadata.email }}
			workspaces={user.workspaces}
			{pathname}
		/>

		<Sidebar.Inset>
			<header
				class="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:hidden"
			>
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<p>{pageName}</p>
				</div>
			</header>
			<div class="bg-background h-full overflow-x-hidden rounded-md p-2 md:m-2">
				{#if fixedScroll}
					<div class="h-full max-h-[95svh] overflow-x-hidden overflow-y-scroll">
						{@render children?.()}
					</div>
				{:else}
					{@render children?.()}
				{/if}
			</div>
		</Sidebar.Inset>

		<!-- document navigation -->
		{#if pathname.includes('/project') && activeProject !== null}
			<NoteSidebar project={activeProject.project} noteTree={activeProject.noteTree} />
		{/if}
	</Sidebar.Provider>
{:else}
	<div class="bg-background h-svh w-full">
		<div class="flex h-full w-full items-center justify-center">
			<div
				class="border-primary size-16 animate-spin rounded-full border-4 border-t-transparent"
			></div>
		</div>
	</div>
{/if}
