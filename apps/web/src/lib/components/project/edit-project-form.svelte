<script lang="ts">
	import type { Note, Project } from '@repo/db';
	import { t } from '@/utils/i18n/translations';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		projectFormSchema,
		type ProjectFormSchema
	} from '$base/src/routes/(dashboard)/projects/edit/[id]/schema';
	import CategoryShell from '../settings/category-shell.svelte';
	import { Textarea } from '../ui/textarea';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Checkbox } from '../ui/checkbox';

	interface Props {
		project: { project: Project & { notes: Note[] }; noteTree: unknown };
		form: SuperValidated<Infer<ProjectFormSchema>>;
	}

	const data: Props = $props();
	const project = data.project.project;

	const form = superForm(data.form, {
		validators: zodClient(projectFormSchema),
		multipleSubmits: 'allow',
		onResult: async ({ result }) => {
			if (result.type === 'success' && result.data) {
				toast.success($t('project.update_success'));
				await goto(`/projects/${project.id}`, { invalidateAll: true });
			} else {
				toast.error($t('project.update_error'));
			}
		}
	});

	const { form: formData, enhance } = form;

	const defaultValues = {
		projectId: project.id,
		name: project.name,
		description: project.description,
		isPublic: project.isPublic
	};

	formData.set(defaultValues);
</script>

<CategoryShell title={$t('project.edit_project')} description={$t('project.edit_project_desc')}>
	<form method="POST" class="space-y-6" use:enhance>
		<Form.Field {form} name="projectId" class={'hidden'}>
			<Form.Control>
				{#snippet children({ props })}
					<Input {...props} bind:value={$formData.projectId} disabled={false} />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{$t('project.name_label')}</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.Description>{$t('project.name_desc')}</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="description">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{$t('project.description_label')}</Form.Label>
					<Textarea {...props} bind:value={$formData.description} />
				{/snippet}
			</Form.Control>
			<Form.Description>{$t('project.description_desc')}</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="isPublic" class="flex-1">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-row items-center gap-4">
						<Checkbox {...props} bind:checked={$formData.isPublic} />
						<Form.Label>Public project</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description
				>Anyone can read a public project. Users will be able to access, share and leave comments.</Form.Description
			>
			<Form.FieldErrors />
		</Form.Field>

		<!-- todo: remove tags -->

		<Form.Button>{$t('project.update_btn')}</Form.Button>
	</form>
</CategoryShell>
