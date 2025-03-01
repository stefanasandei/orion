<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import * as Collapsible from '@/components/ui/collapsible';
	import * as Sidebar from '@/components/ui/sidebar';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { File, Folder } from 'lucide-svelte';
	import { NoteTreeService, type NoteTreeNode, type VizTree } from '@repo/api/services';
	import FiletreeItemContext from './filetree-item-context.svelte';

	interface Props {
		isPublicView?: boolean;
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
	}

	const { noteTree, project, isPublicView = false }: Props = $props();

	const data = $derived(NoteTreeService.toVizFormat(noteTree));
</script>

<div>
	<div class="mt-2 list-none">
		{#each data.tree as item, index (index)}
			{@render Tree({ item })}
		{/each}
	</div>

	<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
	{#snippet Tree({ item }: { item: VizTree })}
		{@const [note, ...items] = Array.isArray(item) ? item : [item]}
		{#if !items.length}
			<FiletreeItemContext projectId={project.id} {isPublicView} hasChildren={false} {note}>
				<a
					href={!isPublicView
						? `/projects/${project.id}/doc/${note.id}`
						: `/browse/project/${project.id}/${note.id}`}
					class="w-full hover:cursor-pointer"
				>
					<Sidebar.MenuButton
						isActive={note.name === 'button.svelte'}
						class="data-[active=true]:bg-transparent"
					>
						<File />
						{note.name.length > 20 ? note.name.substring(0, 20) + '...' : note.name}
					</Sidebar.MenuButton>
				</a>
			</FiletreeItemContext>
		{:else}
			<Sidebar.MenuItem>
				<Collapsible.Root
					class="group/collapsible [&[data-state=open]>div>button>svg:first-child]:rotate-90"
				>
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<FiletreeItemContext {isPublicView} projectId={project.id} hasChildren={true} {note}>
								<Sidebar.MenuButton {...props}>
									<ChevronRight className="transition-transform" />
									<Folder />
									{note.name.length > 20 ? note.name.substring(0, 20) + '...' : note.name}
								</Sidebar.MenuButton>
							</FiletreeItemContext>
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
