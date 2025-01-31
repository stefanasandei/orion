<script lang="ts">
	// TODO

	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Sidebar from '@/components/ui/sidebar';
	import { useSidebar } from '@/components/ui/sidebar/context.svelte.js';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Plus from 'lucide-svelte/icons/plus';

	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { workspaces }: { workspaces: { name: string; logo: any; plan: string }[] } = $props();
	const sidebar = useSidebar();

	let activeworkspace = $state(workspaces[0]);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<activeworkspace.logo class="size-4" />
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">
								{activeworkspace.name}
							</span>
							<span class="truncate text-xs">{activeworkspace.plan}</span>
						</div>
						<ChevronsUpDown class="ml-auto" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				align="start"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				sideOffset={4}
			>
				<DropdownMenu.Label class="text-muted-foreground text-xs">Workspaces</DropdownMenu.Label>
				{#each workspaces as workspace, index (workspace.name)}
					<DropdownMenu.Item onSelect={() => (activeworkspace = workspace)} class="gap-2 p-2">
						<div class="flex size-6 items-center justify-center rounded-sm border">
							<workspace.logo class="size-4 shrink-0" />
						</div>
						{workspace.name}
					</DropdownMenu.Item>
				{/each}
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="gap-2 p-2">
					<div class="bg-background flex size-6 items-center justify-center rounded-md border">
						<Plus class="size-4" />
					</div>
					<a href="/create-workspace" class="text-muted-foreground font-medium"
						>Create a workspace</a
					>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
