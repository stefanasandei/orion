<script lang="ts">
	import * as Sidebar from '@/components/ui/sidebar';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import { Separator } from '@/components/ui/separator';
	import type { Snippet } from 'svelte';
	import Seo from '../seo.svelte';
	import { page } from '$app/state';
	import type { UserLocals } from '@repo/core';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { activeWorkspaceId, initializeActiveWorkspace } from '@/utils/state';
	import { onMount } from 'svelte';

	interface Props {
		pageName: string;
		user: UserLocals;
		children: Snippet;
	}

	const { pageName, user: _user, children }: Props = $props();
	const user = _user.user!;

	const pathname = $derived(page.url.pathname);

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
			<div class="bg-background h-full overflow-hidden rounded-md p-2 md:m-2">
				{@render children?.()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{:else}
<div class="bg-background h-svh w-full">
	<div class="flex h-full w-full items-center justify-center">
		<div class="size-16 animate-spin rounded-full border-4 border-primary border-t-transparent">
		</div>
	</div>
</div>
{/if}
