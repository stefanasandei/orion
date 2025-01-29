<script lang="ts">
	import * as Form from '@/components/ui/form';
	import { Textarea } from '@/components/ui/textarea';
	import { Input } from '@/components/ui/input';
	import { Checkbox } from '@/components/ui/checkbox';
	import { formSchema, type ProfileFormSchema } from './profile-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	let { data }: { data: { form: SuperValidated<Infer<ProfileFormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success('Profile successfully updated!');
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="space-y-6" use:enhance>
	<div class="flex w-full flex-col gap-4 md:flex-row">
		<Form.Field {form} name="firstName" class="flex-1">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>First name</Form.Label>
					<Input {...props} bind:value={$formData.firstName} />
				{/snippet}
			</Form.Control>
			<Form.Description>This is your public display name.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="lastName" class="flex-1">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Last name</Form.Label>
					<Input {...props} bind:value={$formData.firstName} />
				{/snippet}
			</Form.Control>
			<Form.Description>This is your public display name.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<Form.Field {form} name="bio" class="flex-1">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Bio</Form.Label>
				<Textarea {...props} bind:value={$formData.firstName} />
			{/snippet}
		</Form.Control>
		<Form.Description>This is your public display name.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="isPublic" class="flex-1">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-row items-center gap-4">
					<Checkbox {...props} bind:checked={$formData.isPublic} />
					<Form.Label>Public profile</Form.Label>
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description>This is your public display name.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
