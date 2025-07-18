<script lang="ts">
	import type { Note, Project, Tag } from '@repo/db';
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
	import MultiSelect from '../ui/multi-select/multi-select.svelte';

	interface Props {
		project: {
			project: Project & { notes: Note[]; tags: { tagId: number; tag: { name: string } }[] };
			noteTree: unknown;
		};
		tags: { name: string; id: number }[];
		form: SuperValidated<Infer<ProjectFormSchema>>;
	}

	const data: Props = $props();
	const project = data.project.project;

	const tagOptions = $derived(data.tags.map((t) => ({ label: t.name, id: t.id })));

	const form = superForm(data.form, {
		validators: zodClient(projectFormSchema),
		multipleSubmits: 'allow',
		dataType: 'json',
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
		tags: project.tags.map((t) => ({ label: t.tag.name, id: t.tagId })),
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

		<Form.Field {form} name="tags">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{$t('dashboard.lib.tags')}</Form.Label>
					<MultiSelect {...props} bind:selected={$formData.tags} options={tagOptions} name="tags" />
				{/snippet}
			</Form.Control>
			<Form.Description>{$t('dashboard.lib.tags_cta')}</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<input type="hidden" class="hidden" name="tags" value={JSON.stringify($formData.tags)} />

		<Form.Field {form} name="isPublic" class="flex-1">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex flex-row items-center gap-4">
						<Checkbox {...props} bind:checked={$formData.isPublic} />
						<Form.Label>{$t('dashboard.public_project')}</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
			<Form.Description>{$t('dashboard.public_project_desc')}</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Button>{$t('project.update_btn')}</Form.Button>
	</form>
</CategoryShell>
