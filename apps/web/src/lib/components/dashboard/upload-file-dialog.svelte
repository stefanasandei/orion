<script lang="ts">
	import { UploadCloud, X, FileIcon, Upload } from 'lucide-svelte';
	import Dropzone from 'svelte-file-dropzone';
	import { createUploadThing } from '@/utils/uploadthing/utils';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import Button from '../ui/button/button.svelte';
	import { Progress } from '../ui/progress';
	import { cn } from '@/utils/cn';
	import { slide } from 'svelte/transition';
	import * as Dialog from '@/components/ui/dialog';

	type UploadData = {
		accepted: File[];
	};

	let uploadData = $state<UploadData>({ accepted: [] });
	let uploadProgress = $state(0);
	let isUploading = $state(false);

	function handleFilesSelect(e: CustomEvent<any>) {
		const { acceptedFiles } = e.detail;
		uploadData = { accepted: [...uploadData.accepted, ...acceptedFiles] };
	}

	function removeFile(index: number) {
		uploadData.accepted = uploadData.accepted.filter((_, i) => i !== index);
	}

	const { startUpload } = createUploadThing('imageUploader', {
		uploadProgressGranularity: 'fine',

		onUploadBegin: () => {
			isUploading = true;
			toast('Upload started');
		},
		onUploadProgress: (p) => (uploadProgress = p),
		onClientUploadComplete: async () => {
			toast.success('Upload completed successfully');

			uploadProgress = 0;
			isUploading = false;
			uploadData.accepted = [];

			await invalidateAll();
		},
		onUploadError: (error: Error) => {
			isUploading = false;
			toast.error(`Upload failed: ${error.message}`);
		}
	});

	function handleUpload() {
		if (uploadData.accepted.length === 0) {
			toast.error('Please select files first');
			return;
		}

		startUpload(uploadData.accepted, {
			// special id, it will be in the global workspace
			// aka no specific project
			projectId: 0
		});
	}

	function formatFileSize(bytes: number) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full text-left">
		<div
			class="bg-accent/50 hover:bg-accent ring-accent/70 w-full space-y-5 rounded-xl p-4 ring-2 transition-all hover:cursor-pointer"
		>
			<Upload class="size-5" />
			<p>Upload a file</p>
		</div>
	</Dialog.Trigger>
	<Dialog.Content class="md:max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>Upload a file</Dialog.Title>
			<Dialog.Description>The file will be available in your library.</Dialog.Description>
		</Dialog.Header>

		<div class="mx-4 flex flex-col gap-6">
			<div class="bg-card text-card-foreground rounded-lg border shadow-sm">
				<div class="p-6">
					<Dropzone
						on:drop={handleFilesSelect}
						disableDefaultStyles={true}
						containerClasses={cn(
							'relative mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 py-10 text-center transition-colors',
							'hover:bg-muted/50 hover:border-muted-foreground/50',
							uploadData.accepted.length > 0 && 'border-primary/25 hover:border-primary/50'
						)}
					>
						<div class="flex flex-col items-center gap-2">
							<UploadCloud class="text-muted-foreground size-10" />
							<h3 class="text-lg font-semibold">Drag files here or click to upload</h3>
							<p class="text-muted-foreground text-sm">Upload any file type (max 10MB per file)</p>
						</div>
					</Dropzone>
				</div>

				{#if uploadData.accepted.length > 0}
					<div class="border-t">
						<ul class="divide-y">
							{#each uploadData.accepted as file, i (file.name)}
								<li transition:slide class="flex items-center gap-4 p-4">
									<div class="flex min-w-0 flex-1 items-center gap-3">
										<div class="bg-muted rounded-lg p-2">
											<FileIcon class="text-primary size-4" />
										</div>
										<div class="min-w-0 flex-1">
											<p class="truncate text-sm font-medium">{file.name}</p>
											<p class="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
										</div>
									</div>
									<button
										class="hover:bg-muted rounded-full p-1 transition-colors"
										onclick={() => removeFile(i)}
										disabled={isUploading}
									>
										<X class="text-muted-foreground size-4" />
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="bg-muted/50 border-t p-4">
					<div class="flex flex-col gap-4">
						{#if isUploading}
							<Progress value={uploadProgress} class="w-full" />
						{/if}
						<div class="flex items-center justify-between">
							<p class="text-muted-foreground text-sm">
								{uploadData.accepted.length} file{uploadData.accepted.length !== 1 ? 's' : ''} selected
							</p>
							<Button
								onclick={handleUpload}
								disabled={isUploading || uploadData.accepted.length === 0}
								class="min-w-32"
							>
								{#if isUploading}
									Uploading {uploadProgress}%...
								{:else}
									Upload files
								{/if}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
