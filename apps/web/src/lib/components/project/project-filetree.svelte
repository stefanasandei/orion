<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import Button from '@/components/ui/button/button.svelte';
	import { Icons } from '../icons.svelte';
	import * as Collapsible from '@/components/ui/collapsible';
	import * as Sidebar from '@/components/ui/sidebar';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { File, Folder } from 'lucide-svelte';

	interface Props {
		project: Project & { notes: Note[] };
	}

	const { project }: Props = $props();

	// todo: sample data
	const data = {
		tree: [
			['lib', ['components', 'button.svelte', 'card.svelte'], 'utils.ts'],
			[
				'routes',
				['hello', '+page.svelte', '+page.ts'],
				'+page.svelte',
				'+page.server.ts',
				'+layout.svelte'
			],
			['static', 'favicon.ico', 'svelte.svg'],
			'eslint.config.js',
			'.gitignore',
			'svelte.config.js',
			'tailwind.config.js',
			'package.json',
			'README.md'
		]
	};
</script>

<div>
	<div class="mt-2 list-none">
		{#each data.tree as item, index (index)}
			{@render Tree({ item })}
		{/each}
	</div>

	<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
	{#snippet Tree({ item }: { item: string | any[] })}
		{@const [name, ...items] = Array.isArray(item) ? item : [item]}
		{#if !items.length}
			<Sidebar.MenuButton
				isActive={name === 'button.svelte'}
				class="data-[active=true]:bg-transparent"
			>
				<File />
				{name}
			</Sidebar.MenuButton>
		{:else}
			<Sidebar.MenuItem>
				<Collapsible.Root
					class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
					open={name === 'lib' || name === 'components'}
				>
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton {...props}>
								<ChevronRight className="transition-transform" />
								<Folder />
								{name}
							</Sidebar.MenuButton>
						{/snippet}
					</Collapsible.Trigger>
					<Collapsible.Content>
						<Sidebar.MenuSub>
							{#each items as subItem, index (index)}
								{@render Tree({ item: subItem })}
							{/each}
						</Sidebar.MenuSub>
					</Collapsible.Content>
				</Collapsible.Root>
			</Sidebar.MenuItem>
		{/if}
	{/snippet}
</div>
