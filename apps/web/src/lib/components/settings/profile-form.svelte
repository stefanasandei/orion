<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { Textarea } from '@/components/ui/textarea';
	import { Input } from '@/components/ui/input';
	import { Checkbox } from '@/components/ui/checkbox';
	import { formSchema, type ProfileFormSchema } from './profile-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import type { UserLocals } from '@repo/core';
	import { t } from '@/utils/i18n/translations';

	let {
		data
	}: { data: { form: SuperValidated<Infer<ProfileFormSchema>>; user: UserLocals } } =
		$props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		multipleSubmits: 'allow',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast.success('Profile successfully updated!');
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance, timeout } = form;

	const defaultValues = {
		firstName: data.user.user!.metadata.name.split(' ')[0],
		lastName: data.user.user!.metadata.name.split(' ')[1],
		bio: data.user.user!.metadata.bio,
		isPublic: data.user.user!.metadata.isPublic
	};
	formData.set(defaultValues);
</script>

<form method="POST" class="space-y-6" use:enhance>
	<div class="flex w-full flex-col gap-4 md:flex-row">
		<Form.Field {form} name="firstName" class="flex-1">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{$t('settings.first_name')}</Form.Label>
					<Input {...props} bind:value={$formData.firstName} />
				{/snippet}
			</Form.Control>
			<Form.Description>{$t('settings.first_name_desc')}</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="lastName" class="flex-1">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>{$t('settings.last_name')}</Form.Label>
					<Input {...props} bind:value={$formData.lastName} />
				{/snippet}
			</Form.Control>
			<Form.Description>{$t('settings.last_name_desc')}</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Form.Field {form} name="bio" class="flex-1">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>{$t('settings.bio')}</Form.Label>
				<Textarea {...props} bind:value={$formData.bio} />
			{/snippet}
		</Form.Control>
		<Form.Description>{$t('settings.bio_desc')}</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="isPublic" class="flex-1">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-row items-center gap-4">
					<Checkbox {...props} bind:checked={$formData.isPublic} />
					<Form.Label>{$t('settings.public_profile')}</Form.Label>
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description>{$t('settings.public_profile_desc')}</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button disabled={$timeout}>{$t('settings.update_profile')}</Form.Button>
</form>
