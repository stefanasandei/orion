<script lang="ts">
	import * as Avatar from '@/components/ui/avatar';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Sidebar from '@/components/ui/sidebar';
	import { useSidebar } from '@/components/ui/sidebar/context.svelte.js';
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import Bell from 'lucide-svelte/icons/bell';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { trpc } from '@/utils/trpc/client';
	import { goto } from '$app/navigation';
	import { t } from '@/utils/i18n/translations';
	import { activeWorkspaceId } from '../utils/state';

	let { user }: { user: { name: string; email: string } } = $props();
	const sidebar = useSidebar();

	const shortUsername = user.name
		.split(' ')
		.map((name) => name[0])
		.join('');

	const logout = trpc().user.logout.createMutation({
		onSuccess: async () => {
			activeWorkspaceId.current = -1;
			await goto('/login', { invalidateAll: true });
		}
	});
</script>

<Sidebar.Menu class="bg-background rounded-lg p-2">
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="h-8 w-8 rounded-lg">
							<!-- <Avatar.Image src={user.avatar} alt={user.name} /> -->
							<Avatar.Fallback class="rounded-lg">{shortUsername}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
						<EllipsisVertical class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="h-8 w-8 rounded-lg">
							<!-- <Avatar.Image src={user.avatar} alt={user.name} /> -->
							<Avatar.Fallback class="rounded-lg">{shortUsername}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<!-- <DropdownMenu.Group>
					<DropdownMenu.Item>
						<Sparkles />
						Upgrade to Pro
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator /> -->
				<DropdownMenu.Group>
					<a href="/settings/account">
						<DropdownMenu.Item>
							<BadgeCheck />
							{$t('dashboard.account')}
						</DropdownMenu.Item></a
					>
					<a href="/notifications">
						<DropdownMenu.Item>
							<Bell />
							{$t('dashboard.notifications')}
						</DropdownMenu.Item>
					</a>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={() => $logout.mutate()}>
					<LogOut />
					{$t('auth.logout')}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
