<script lang="ts" module>
	import AudioWaveform from 'lucide-svelte/icons/audio-waveform';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import Bot from 'lucide-svelte/icons/bot';
	import ChartPie from 'lucide-svelte/icons/chart-pie';
	import Command from 'lucide-svelte/icons/command';
	import Frame from 'lucide-svelte/icons/frame';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
	import Map from 'lucide-svelte/icons/map';
	import Settings2 from 'lucide-svelte/icons/settings-2';
	import SquareTerminal from 'lucide-svelte/icons/square-terminal';
	import { t } from '@/utils/i18n/translations';

	// TODO: This is sample data.
	const data = {
		workspaces: [
			{
				name: t.get('dashboard.default_workspace'),
				logo: GalleryVerticalEnd,
				plan: t.get('dashboard.free')
			}
		],
		navMain: [
			{
				title: t.get('dashboard.home'),
				url: '/',
				icon: SquareTerminal,
				isActive: true,
				items: []
			},
			{
				title: t.get('dashboard.settings'),
				url: '/settings',
				icon: Settings2,
				items: [
					{
						title: t.get('dashboard.profile'),
						url: '/settings'
					},
					{
						title: t.get('dashboard.account'),
						url: '/settings/account'
					},
					{
						title: t.get('dashboard.appearance'),
						url: '/settings/appearance'
					}
				]
			}
		],
		projects: [
			// {
			// 	name: 'Design Engineering',
			// 	url: '#',
			// 	icon: Frame
			// },
		]
	};
</script>

<script lang="ts">
	import NavMain from '@/components/side-nav-main.svelte';
	import NavProjects from '@/components/nav-projects.svelte';
	import NavUser from '@/components/nav-user.svelte';
	import WorkspaceSwitcher from '$base/src/lib/components/workspace-switcher.svelte';
	import * as Sidebar from '@/components/ui/sidebar';
	import type { ComponentProps } from 'svelte';

	interface Properties {
		user: {
			name: string;
			email: string;
		};
		pathname: string;
	}

	let {
		user,
		pathname,
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & Properties = $props();
</script>

<div class="flex md:hidden">
	<Sidebar.Root class="bg-muted h-screen py-2 pl-2" collapsible={'icon'} bind:ref {...restProps}>
		<Sidebar.Header class="bg-muted p-0">
			<WorkspaceSwitcher workspaces={data.workspaces} />
		</Sidebar.Header>
		<Sidebar.Content class="bg-muted h-full p-0">
			<NavMain {pathname} items={data.navMain} />
			<!-- <NavProjects projects={data.projects} /> -->
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
			<WorkspaceSwitcher workspaces={data.workspaces} />
		</Sidebar.Header>
		<Sidebar.Content class="bg-muted h-full p-0">
			<NavMain {pathname} items={data.navMain} />
			<!-- <NavProjects projects={data.projects} /> -->
		</Sidebar.Content>
		<Sidebar.Footer class="bg-muted p-0">
			<NavUser {user} />
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>
</div>
