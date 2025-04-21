<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { Note, Tag } from '@repo/db';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import * as Tabs from '@/components/ui/tabs';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { goto, invalidateAll } from '$app/navigation';
	import { Icons } from '$base/src/lib/components/icons.svelte';
	import HtmlPreview from '$base/src/lib/components/html-preview.svelte';
	import { parse } from 'marked';
	import { Pen, Eye, Save, ArrowLeft } from 'lucide-svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Textarea from '$base/src/lib/components/ui/textarea/textarea.svelte';
	import MultiSelect from '$base/src/lib/components/ui/multi-select/multi-select.svelte';

	let {
		data: _data
	}: {
		data: { user: UserLocals; thought: Note; tags: Tag[]; form: SuperValidated<Infer<FormSchema>> };
	} = $props();
	const { user, thought, tags } = $derived(_data);

	const form = superForm(_data.form, {
		validators: zodClient(formSchema),
		dataType: 'json',
		onUpdated: () => {
			toast.success('Note updated!');
		},
		resetForm: false
	});

	const { form: formData, enhance } = form;

	let activeTab = $state('edit');
	let parsedContent = $derived(parse($formData.thought || ''));
	const tagOptions = $derived(tags.map((t) => ({ label: t.name, id: t.id })));
</script>

<DashboardShell className="h-full flex" pageName={'Edit Thought'} {user}>
	<div class="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col gap-4">
		<div class="flex items-center justify-between">
			<Button variant="ghost" class="gap-2" onclick={() => history.back()}>
				<ArrowLeft class="h-4 w-4" />
				Back
			</Button>
			<p class="text-muted-foreground text-sm">
				Last updated: {new Date(thought.updatedAt || thought.createdAt).toLocaleString()}
			</p>
		</div>

		<Card.Root class="flex-1">
			<Card.Header>
				<Card.Title class="text-2xl font-bold">Edit Thought</Card.Title>
				<Card.Description>
					Edit your thought content below. Use markdown for formatting.
				</Card.Description>
			</Card.Header>
			<Card.Content class="flex h-[calc(100%-6rem)] flex-col space-y-4">
				<Tabs.Root value={activeTab} class="flex-1" onValueChange={(value) => (activeTab = value)}>
					<Tabs.List>
						<Tabs.Trigger value="edit" class="gap-2">
							<Pen class="h-4 w-4" />
							Edit
						</Tabs.Trigger>
						<Tabs.Trigger value="preview" class="gap-2">
							<Eye class="h-4 w-4" />
							Preview
						</Tabs.Trigger>
					</Tabs.List>
					<form method="POST" use:enhance class="flex h-fit flex-col md:min-h-[calc(100%-0.5rem)]">
						<Tabs.Content value="edit" class="flex-1 border-none p-0 outline-none">
							<Form.Field class="h-full pb-4" {form} name="thought">
								<Form.Control>
									{#snippet children({ props })}
										<Textarea
											class="h-full min-h-[300px] resize-none rounded-lg  border-x-0"
											placeholder="Write your thoughts here... Use markdown for formatting."
											{...props}
											bind:value={$formData.thought}
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors class="mt-2" />
							</Form.Field>

							<Form.Field {form} name="tags">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>{'Tags'}</Form.Label>
										<MultiSelect
											{...props}
											bind:selected={$formData.tags}
											options={tagOptions}
											name="tags"
										/>
									{/snippet}
								</Form.Control>
								<Form.Description
									>{'Add a few tags to your note, to find it more easily.'}</Form.Description
								>
								<Form.FieldErrors />
							</Form.Field>

							<input type="hidden" name="tags" value={JSON.stringify($formData.tags)} />
						</Tabs.Content>

						<Tabs.Content
							value="preview"
							class="flex-1 border-none px-4 py-2 outline-none data-[state=active]:block"
						>
							<div class="prose dark:prose-invert h-full max-w-none overflow-y-auto">
								{@html parsedContent}
							</div>
						</Tabs.Content>

						<div class="flex items-center justify-end py-2">
							<Button type="submit" class="gap-2">
								<Save class="h-4 w-4" />
								Save Changes
							</Button>
						</div>
					</form>
				</Tabs.Root>
			</Card.Content>
		</Card.Root>
	</div>
</DashboardShell>
