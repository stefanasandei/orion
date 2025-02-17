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
	import { invalidateAll } from '$app/navigation';

	interface Props {
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
	}

	const { noteTree, project }: Props = $props();

	// utils to create a new top-level note
	let addNewFile = $state(false);
	let newDocName = $state('');

	const createNoteDocument = trpc().project.createNoteDocument.createMutation({
		onSuccess: async () => {
			toast.success(`Created ${newDocName}!`);
			await invalidateAll();
		}
	});

	const createFile = () => {
		$createNoteDocument.mutate({
			noteName: newDocName,
			projectId: project.id
		});

		newDocName = '';
		addNewFile = false;
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && newDocName.trim()) {
			createFile();
		}
	};
</script>

<div>
	<div class="flex flex-row items-center justify-between">
		<p class="text-2xl">Documents</p>
		<Button
			class="ml-3"
			size={'small-icon'}
			variant={'secondary'}
			onclick={() => (addNewFile = !addNewFile)}
		>
			<Icons.add />
		</Button>
	</div>

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
