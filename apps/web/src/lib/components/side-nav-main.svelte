<script lang="ts">
	import * as Collapsible from '@/components/ui/collapsible';
	import * as Sidebar from '@/components/ui/sidebar';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import type { ComponentType } from 'svelte';

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
		items
	}: {
		items: MenuItem[];
	} = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			{#if mainItem.items && mainItem.items.length > 0}
				<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
					<Sidebar.MenuItem>
						<Collapsible.Trigger>
							{#snippet child({ props }: { props: any })}
								<Sidebar.MenuButton {...props}>
									{#snippet tooltipContent()}
										{mainItem.title}
									{/snippet}
									{#if mainItem.icon}
										<!-- svelte-ignore svelte_component_deprecated -->
										<svelte:component this={mainItem.icon} />
									{/if}
									<span>{mainItem.title}</span>
									<ChevronRight
										class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
									/>
								</Sidebar.MenuButton>
							{/snippet}
						</Collapsible.Trigger>
						<Collapsible.Content>
							<Sidebar.MenuSub>
								{#each mainItem.items as subItem (subItem.title)}
									<Sidebar.MenuSubItem>
										<Sidebar.MenuSubButton>
											{#snippet child({ props })}
												<a href={subItem.url} {...props}>
													<span>{subItem.title}</span>
												</a>
											{/snippet}
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								{/each}
							</Sidebar.MenuSub>
						</Collapsible.Content>
					</Sidebar.MenuItem>
				</Collapsible.Root>
			{:else}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props }: { props: any })}
							<Sidebar.MenuButton {...props}>
								{#snippet tooltipContent()}
									{mainItem.title}
								{/snippet}
								{#if mainItem.icon}
									<!-- svelte-ignore svelte_component_deprecated -->
									<svelte:component this={mainItem.icon} />
								{/if}
								<span>{mainItem.title}</span>
							</Sidebar.MenuButton>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/if}
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
