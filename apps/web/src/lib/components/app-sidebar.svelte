<script lang="ts">
	import NavMain from '@/components/side-nav-main.svelte';
	import NavProjects from '@/components/nav-projects.svelte';
	import NavUser from '@/components/nav-user.svelte';
	import WorkspaceSwitcher from '$base/src/lib/components/workspace-switcher.svelte';
	import * as Sidebar from '@/components/ui/sidebar';
	import type { ComponentProps } from 'svelte';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import SquareTerminal from 'lucide-svelte/icons/square-terminal';
	import House from 'lucide-svelte/icons/house';
	import Browser from 'lucide-svelte/icons/book-marked';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import { activeWorkspaceId } from '../utils/state';

	const navItems = $derived([
		{
			title: $t('dashboard.home'),
			url: '/',
			icon: House,
			isActive: true,
			items: []
		},
		{
			title: $t('dashboard.assistant'),
			url: '/assistant',
			icon: SquareTerminal,
			isActive: true,
			items: []
		},
		{
			title: $t('dashboard.browse_content'),
			url: '/browse',
			icon: Browser,
			isActive: true,
			items: []
		},
		{
			title: $t('dashboard.settings'),
			url: '/settings',
			icon: Settings2,
			items: [
				{
					title: $t('dashboard.profile'),
					url: '/settings'
				},
				{
					title: $t('dashboard.account'),
					url: '/settings/account'
				},
				{
					title: $t('dashboard.appearance'),
					url: '/settings/appearance'
				}
			]
		}
	]);

	interface Properties {
		user: {
			name: string;
			email: string;
		};
		workspaces: NonNullable<UserLocals['user']>['workspaces'];
		pathname: string;
	}


	let {
		user,
		workspaces,
		pathname,
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & Properties = $props();

	const parsedWorkspaces = workspaces.map((w) => {
		return {
			id: w.id,
			name: w.name!,
			logo: GalleryVerticalEnd,
			plan: $t('dashboard.free')
		};
	});

	let activeworkspace = $derived(workspaces.find((v) => v.id == activeWorkspaceId.current));
	let projects = $derived(activeworkspace!.projects);

	const parsedProjects = $derived(projects.map((p) => {
		return {
			name: p.name!,
			url: `/projects/${p.id}`,
			icon: GalleryVerticalEnd
		};
	}));
</script>

<div class="flex md:hidden">
	<Sidebar.Root class="bg-muted h-screen py-2 pl-2" collapsible={'icon'} bind:ref {...restProps}>
		<Sidebar.Header class="bg-muted p-0">
			<WorkspaceSwitcher workspaces={parsedWorkspaces} />
		</Sidebar.Header>
		<Sidebar.Content class="bg-muted h-full p-0">
			<NavProjects projects={parsedProjects} />
			<NavMain {pathname} items={navItems} />
		</Sidebar.Content>
		<Sidebar.Footer class="bg-muted p-0">
			<NavUser {user} />
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>
</div>

<div class="hidden md:flex">
	<Sidebar.Root class="bg-muted h-screen py-2 pl-2" collapsible={'icon'} bind:ref {...restProps}>
		<Sidebar.Header class="bg-muted p-0">
			<WorkspaceSwitcher workspaces={parsedWorkspaces} />
		</Sidebar.Header>
		<Sidebar.Content class="bg-muted h-full p-0">
			<NavProjects projects={parsedProjects} />
			<NavMain {pathname} items={navItems} />
		</Sidebar.Content>
		<Sidebar.Footer class="bg-muted p-0">
			<NavUser {user} />
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>
</div>
