<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { useSidebar } from '@/components/ui/sidebar/context.svelte.js';
	import * as Sidebar from '@/components/ui/sidebar';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import Folder from 'lucide-svelte/icons/folder';
	import Forward from 'lucide-svelte/icons/forward';
	import { t } from '@/utils/i18n/translations';
	import CreateProject from '@/components/project/create-project.svelte';
	import DeleteProject from '@/components/project/delete-project.svelte';

	let {
		projects
	}: {
		projects: {
			id: number;
			name: string;
			url: string;
			// This should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon: any;
		}[];
	} = $props();

	const sidebar = useSidebar();
</script>

<Sidebar.Group class="bg-background mt-2 h-full rounded-lg group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel class="flex flex-row justify-between">
		<p>{$t('dashboard.projects')}</p>
		<div class="flex w-fit items-end justify-end">
			<CreateProject />
		</div>
	</Sidebar.GroupLabel>
	<Sidebar.Menu class="flex-1">
		{#each projects as item (item.name)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={item.url} class="flex flex-row justify-between" {...props}>
							<span class="flex flex-row items-center gap-2">
								<item.icon class="p-1" />
								<span>{item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}</span
								>
							</span>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Sidebar.MenuAction showOnHover {...props}>
											<Ellipsis />
											<span class="sr-only">More</span>
										</Sidebar.MenuAction>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content
									class="w-48 rounded-lg"
									side={sidebar.isMobile ? 'bottom' : 'right'}
									align={sidebar.isMobile ? 'end' : 'start'}
								>
									<DropdownMenu.Item onclick={() => alert(`Not implemented: ${item.id}`)}>
										<Folder class="text-muted-foreground" />
										<span>{$t('project.view')}</span>
									</DropdownMenu.Item>
									<DropdownMenu.Item onclick={() => alert(`Not implemented: ${item.id}`)}>
										<Forward class="text-muted-foreground" />
										<span>{$t('project.share')}</span>
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item class="w-full">
										{#snippet child({ props })}
											<DeleteProject {item} />
										{/snippet}
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}

		{#if projects.length == 0}
			<div class="flex h-full flex-1 items-center justify-center text-center">
				<p>{$t('dashboard.no_projects')}</p>
			</div>
		{/if}
		<!-- <Sidebar.MenuItem>
			<Sidebar.MenuButton class="text-sidebar-foreground/70">
				<Ellipsis class="text-sidebar-foreground/70" />
				<span>More</span>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem> -->
	</Sidebar.Menu>
</Sidebar.Group>
