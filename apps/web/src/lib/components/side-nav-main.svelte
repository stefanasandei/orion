<script lang="ts">
	import * as Collapsible from '@/components/ui/collapsible';
	import * as Sidebar from '@/components/ui/sidebar';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import type { ComponentType } from 'svelte';
	import { cn } from '../utils/cn';
	import { t } from '@/utils/i18n/translations';

	interface MenuItem {
		title: string;
		url: string;
		icon?: ComponentType;
		isActive?: boolean;
		items?: SubMenuItem[];
	}

	interface SubMenuItem {
		title: string;
		url: string;
	}

	let {
		items,
		pathname
	}: {
		items: MenuItem[];
		pathname: string;
	} = $props();

	/*
	TODO:
	- remember whole (app-sidebar) collapsed state between pages
	- collapsed items should have a link to their main url
	-- item sections shoudl be open by default when you are in a page that belongs to that section
	- redo ui/ux of the links, bigger more joyful idk
	*/
</script>

<Sidebar.Group class="bg-background my-2 h-full rounded-lg">
	<Sidebar.GroupLabel>{$t('dashboard.section_platform')}</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			{#if mainItem.items!.length != 0}
				<Collapsible.Root
					open={mainItem.isActive || pathname.startsWith(mainItem.url)}
					class="group/collapsible"
				>
					{#snippet child({ props })}
						<Sidebar.MenuItem {...props}>
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton
										{...props}
										class={cn(pathname.startsWith(mainItem.url) ? 'bg-muted/50' : '')}
									>
										{#snippet tooltipContent()}
											{mainItem.title}
										{/snippet}
										{#if mainItem.icon}
											<mainItem.icon />
										{/if}
										<span>{mainItem.title}</span>
										<ChevronRight
											class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content>
								{#if mainItem.items}
									<Sidebar.MenuSub>
										{#each mainItem.items as subItem (subItem.title)}
											<Sidebar.MenuSubItem>
												<Sidebar.MenuSubButton
													class={cn(pathname == subItem.url ? 'bg-muted/50' : '')}
												>
													{#snippet child({ props })}
														<a href={subItem.url} {...props}>
															<span>{subItem.title}</span>
														</a>
													{/snippet}
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
										{/each}
									</Sidebar.MenuSub>
								{/if}
							</Collapsible.Content>
						</Sidebar.MenuItem>
					{/snippet}
				</Collapsible.Root>
			{:else}
				<Sidebar.MenuItem>
					<a href={mainItem.url}>
						<Sidebar.MenuButton class={cn(pathname == mainItem.url ? 'bg-muted/50' : '')}>
							{#snippet tooltipContent()}
								{mainItem.title}
							{/snippet}
							{#if mainItem.icon}
								<mainItem.icon />
							{/if}
							<span>{mainItem.title}</span>
						</Sidebar.MenuButton>
					</a>
				</Sidebar.MenuItem>
			{/if}
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
