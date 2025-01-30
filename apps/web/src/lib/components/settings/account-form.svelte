<script lang="ts">
	import type { UserMetadata } from '@repo/db';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Button } from '@/components/ui/button';
	import { formSchema, type AccountFormSchema } from './account-schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '@/components/ui/select';

	let {
		data
	}: { data: { form: SuperValidated<Infer<AccountFormSchema>>; userMetadata: UserMetadata } } =
		$props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<!-- confirm email & setup 2fa -->
<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div>
			<div class="mb-2 flex flex-row items-center gap-3">
				<Label>Email</Label>
				{#if data.userMetadata.emailVerified}
					<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">verified</p>
				{:else}
					<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">
						not verified
					</p>
				{/if}
			</div>
			<p>{data.userMetadata.email}</p>
		</div>

		{#if !data.userMetadata.emailVerified}
			<Button>Send verification email</Button>
		{/if}
	</div>

	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div class="mb-2 flex flex-row items-center gap-3">
			<Label>Two-factor authentication (2FA)</Label>
			{#if data.userMetadata.emailVerified}
				<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">active</p>
			{:else}
				<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">not active</p>
			{/if}
		</div>
		{#if !data.userMetadata.emailVerified}
			<Button>Setup 2FA</Button>
		{/if}
	</div>
</div>

<!-- language -->
<form method="POST" use:enhance>
	<h2 class="mb-3 text-xl">Preferences</h2>

	<Form.Field {form} name="language">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Language</Form.Label>
				<Select.Root type="single" bind:value={$formData.language} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.language}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="English" label="English" />
						<Select.Item value="Romanian" label="Romanian" />
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description>This is the language used in the interface.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Update account preferences</Form.Button>
</form>
