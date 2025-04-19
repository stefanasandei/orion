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
	import * as Select from '@/components/ui/select';
	import { createUploadThing } from '@/utils/uploadthing/utils';
	import { Label } from '@/components/ui/label';

	interface Props {
		isPublicView?: boolean;
		project: Project & { notes: Note[] };
		noteTree: NoteTreeNode[];
		sidebar?: boolean;
	}

	const { noteTree, project, sidebar = false, isPublicView = false }: Props = $props();

	// utils to create a new top-level note
	let addNewFile = $state(false);
	let newDocName = $state('');
	let newDocType = $state<'note' | 'file'>('note');
	let uploadProgress = $state(0);

	const createNoteDocument = trpc().project.createNoteDocument.createMutation({
		onSuccess: async () => {
			toast.success($t('project.created_doc', { default: newDocName }));
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

	const { startUpload } = createUploadThing('imageUploader', {
		onUploadBegin: () => {
			toast('Upload begun!');
		},
		onUploadProgress: (p) => (uploadProgress = p),
		onClientUploadComplete: async (res) => {
			toast.success('Upload Completed');

			addNewFile = false;
			uploadProgress = 0;
			newDocType = 'note';

			await invalidateAll();
		},
		onUploadError: (error: Error) => {
			toast.error(`ERROR! ${error.message}`);
		}
	});
</script>

<div class="flex h-full flex-col justify-between group-data-[collapsible=icon]:hidden">
	<div>
		<div class="flex flex-row items-center justify-between p-2">
			<p class="text-2xl">{$t('project.documents')}</p>

			{#if !isPublicView}
				{#if !addNewFile}
					<Button
						class="ml-3"
						size={'small-icon'}
						variant={'secondary'}
						onclick={() => (addNewFile = !addNewFile)}
					>
						<Icons.add />
					</Button>
				{:else}
					<div class="flex flex-row items-center gap-2">
						<Select.Root bind:value={newDocType} type="single">
							<Select.Trigger class="w-fit md:w-[120px]">{newDocType}</Select.Trigger>
							<Select.Content>
								<Select.Item value="note">note</Select.Item>
								<Select.Item value="file">file</Select.Item>
							</Select.Content>
						</Select.Root>

						<Button
							class="ml-3"
							size={'small-icon'}
							variant={'secondary'}
							onclick={() => (addNewFile = !addNewFile)}
						>
							<Icons.close />
						</Button>
					</div>
				{/if}
			{/if}
		</div>
		<Separator />

		{#if addNewFile}
			{#if newDocType == 'note'}
				<div class="mt-3 flex w-full flex-row gap-4">
					<Input
						class="h-fit"
						bind:value={newDocName}
						placeholder={$t('project.document_name')}
						onkeydown={handleKeydown}
					/>

					<Button size="sm" onclick={() => createFile()}>{$t('project.add')}</Button>
				</div>
			{:else}
				<div class="mt-3 grid w-full grid-cols-2 items-center gap-4">
					<Input
						id="file"
						type="file"
						onchange={async (e) => {
							const file = e.currentTarget.files?.[0];
							if (!file) return;

							await startUpload([file], { projectId: project.id });
						}}
					/>

					{#if uploadProgress == 0}
						<Label for="file">File upload</Label>
					{:else}
						<Label for="file">Uploaded {uploadProgress}%</Label>
					{/if}
				</div>
			{/if}
		{/if}

		{#if noteTree.length != 0}
			<ProjectFiletree {isPublicView} {noteTree} {project} />
		{:else}
			<p class="text-foreground/60 mt-4 text-center">{$t('project.empty')}</p>
		{/if}
	</div>

	{#if sidebar}
		<div class="flex flex-col items-center justify-center p-2">
			<Button
				size="sm"
				variant="outline"
				class="mb-2 w-full"
				onclick={async () => {
					// todo: clear only tabs for the current project
					editorState.current = { tabs: [] };
					toast($t('project.cleared_tabs'));
					await goto(`/projects/${project.id}`, {
						invalidateAll: true
					});
				}}>{$t('project.clear_tabs')}</Button
			>
			<Separator class="bg-muted-foreground/20 mb-2" />
			<p>{`${project.name}: ` + $t('project.doc_count', { default: project.notes.length })}</p>
		</div>
	{/if}
</div>

<div class="hidden items-center justify-center rounded-full group-data-[collapsible=icon]:flex">
	<File />
</div>
