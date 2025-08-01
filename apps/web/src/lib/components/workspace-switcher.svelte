<script lang="ts">
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Sidebar from '@/components/ui/sidebar';
	import { useSidebar } from '@/components/ui/sidebar/context.svelte.js';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import Plus from 'lucide-svelte/icons/plus';
	import { t } from '@/utils/i18n/translations';
	import { activeWorkspaceId } from '../utils/state';
	import { goto } from '$app/navigation';

	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { workspaces }: { workspaces: { id: number; name: string; logo: any; plan: string }[] } =
		$props();
	const sidebar = useSidebar();

	let activeworkspace = $derived(workspaces.find((v) => v.id == activeWorkspaceId.current));

	const changeWorkspace = async (id: number) => {
		activeWorkspaceId.current = id;
		await goto('/');
	};
</script>

<Sidebar.Menu class="bg-background rounded-lg p-2">
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
							{#if activeworkspace != undefined}
								<activeworkspace.logo class="size-4" />
							{/if}
						</div>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">
								{activeworkspace ? activeworkspace.name : 'none'}
							</span>
							<span class="truncate text-xs">{activeworkspace ? activeworkspace.plan : ''}</span>
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
				<DropdownMenu.Label class="text-muted-foreground text-xs"
					>{$t('dashboard.workspace_title')}</DropdownMenu.Label
				>
				{#each workspaces as workspace, index (workspace.id)}
					<DropdownMenu.Item
						onSelect={async () => await changeWorkspace(workspace.id)}
						class="gap-2 p-2"
					>
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
						>{$t('dashboard.create_workspace')}</a
					>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
