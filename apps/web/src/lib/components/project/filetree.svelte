<script lang="ts">
	import { t } from '@/utils/i18n/translations';
	import type { Note, Project } from '@repo/db';
	import Button from '@/components/ui/button/button.svelte';
	import { Icons } from '../icons.svelte';
	import { Input } from '@/components/ui/input';
	import ProjectFiletree from './project-filetree.svelte';
	import type { NoteTreeNode } from '@repo/api/services';
	import { toast } from 'svelte-sonner';
	import { trpc } from '@/utils/trpc/client';
	import { goto, invalidateAll } from '$app/navigation';
	import { File } from 'lucide-svelte';
	import Separator from '../ui/separator/separator.svelte';
	import { editorState } from '../../utils/state';

	interface Props {
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
		sidebar?: boolean;
	}

	const { noteTree, project, sidebar = false }: Props = $props();

	// utils to create a new top-level note
	let addNewFile = $state(false);
	let newDocName = $state('');

	const createNoteDocument = trpc().project.createNoteDocument.createMutation({
		onSuccess: async () => {
			toast.success(`Created ${newDocName}!`);
			await invalidateAll();
		},
		onSettled: () => {
			newDocName = '';
		}
	});

	const createFile = () => {
		$createNoteDocument.mutate({
			noteName: newDocName,
			projectId: project.id
		});

		addNewFile = false;
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && newDocName.trim()) {
			createFile();
		}
	};
</script>

<div class="flex h-full flex-col justify-between group-data-[collapsible=icon]:hidden">
	<div>
		<div class="flex flex-row items-center justify-between p-2">
			<p class="text-2xl">Documents</p>

			<Button
				class="ml-3"
				size={'small-icon'}
				variant={'secondary'}
				onclick={() => (addNewFile = !addNewFile)}
			>
				{#if !addNewFile}
					<Icons.add />
				{:else}
					<Icons.close />
				{/if}
			</Button>
		</div>
		<Separator class="bg-muted-foreground/20" />

		{#if addNewFile}
			<div class="mt-3 flex w-full flex-row gap-4">
				<Input
					class="h-fit"
					bind:value={newDocName}
					placeholder="document name"
					onkeydown={handleKeydown}
				/>
				<Button size="sm" onclick={() => createFile()}>Add</Button>
			</div>
		{/if}

		<ProjectFiletree {noteTree} {project} />
	</div>

	{#if sidebar}
		<div class="flex flex-col items-center justify-center p-2">
			<Button
				size="sm"
				variant="outline"
				class="mb-2 w-full"
				onclick={async () => {
					editorState.current = { tabs: [] };
					toast('Cleared all tabs!');
					await goto(`/projects/${project.id}`, {
						invalidateAll: true
					});
				}}>Clear all tabs</Button
			>
			<Separator class="bg-muted-foreground/20 mb-2" />
			<p>{project.name}: {project.notes.length} documents</p>
		</div>
	{/if}
</div>

<div class="hidden items-center justify-center rounded-full group-data-[collapsible=icon]:flex">
	<File />
</div>
