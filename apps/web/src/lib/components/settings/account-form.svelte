<script lang="ts">
	import type { User, UserMetadata } from '@repo/db';
	import * as Form from '@/components/ui/form';
	import { Label } from '@/components/ui/label';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { formSchema, type AccountFormSchema } from './account-schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '@/components/ui/select';
	import { cn } from '@/utils/cn';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { lastVerificationEmailSent } from '@/utils/stores';
	import { onMount } from 'svelte';
	import SetupTwoFactor from '@/components/auth/2fa-setup.svelte';

	// component props
	let {
		data
	}: {
		data: {
			form: SuperValidated<Infer<AccountFormSchema>>;
			userMetadata: UserMetadata;
			user: User;
		};
	} = $props();

	// setup form
	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;

	// utility functions
	const sendConfirmationEmail = trpc().user.sendConfirmationEmail.createMutation({
		onSuccess: () => {
			toast.success('Confirmation email sent.');
			$lastVerificationEmailSent = Date.now();
		}
	});

	// cooldown for sending email
	const COOLDOWN_HOURS = 12;
	const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

	// Initialize as loading to prevent flash of enabled state
	let cooldownCalculated = $state(false);

	// Once mounted, calculate cooldown state
	onMount(() => {
		cooldownCalculated = true;
	});

	const timeRemaining = $derived(
		Math.max(0, $lastVerificationEmailSent + COOLDOWN_MS - Date.now())
	);
	const canSendEmail = $derived(cooldownCalculated && timeRemaining === 0);
	const hoursRemaining = $derived(Math.floor(timeRemaining / (60 * 60 * 1000)));
</script>

<!-- confirm email & setup 2fa -->
<h2 class="mb-3 text-xl font-bold">Security</h2>
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
			<Button onclick={() => $sendConfirmationEmail.mutate()} disabled={!canSendEmail}>
				{#if !cooldownCalculated}
					Loading...
				{:else if canSendEmail}
					Send verification email
				{:else}
					Wait {hoursRemaining} hour{hoursRemaining === 1 ? '' : 's'}
				{/if}
			</Button>
		{/if}
	</div>
	<div class="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
		<div class="mb-2 flex flex-row items-center gap-3">
			<Label>Two-factor authentication (2FA)</Label>
			{#if data.userMetadata.twoFactorEnabled}
				<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">active</p>
			{:else}
				<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">not active</p>
			{/if}
		</div>
		{#if !data.userMetadata.twoFactorEnabled}
			<!-- todo: allow for reset -->
			<SetupTwoFactor />
		{/if}
	</div>
</div>

<div>
	<p class="mb-1 text-xl font-bold">Socials</p>
	<p class="mb-3">Enable authentication with other social accounts.</p>
</div>
<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div class="mb-2 flex flex-row items-center gap-3">
			<Label>GitHub</Label>
			{#if data.user.githubId !== null}
				<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">linked</p>
			{:else}
				<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">not linked</p>
			{/if}
		</div>

		{#if data.user.githubId === null}
			<a href="/login/github" class={cn(buttonVariants({ size: 'sm' }), 'w-min')}>Link GitHub</a>
		{/if}
	</div>

	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div class="mb-2 flex flex-row items-center gap-3">
			<Label>Discord</Label>
			{#if false}
				<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">linked</p>
			{:else}
				<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">
					not available yet
				</p>
			{/if}
		</div>

		{#if !false}
			<Button size="sm" class="w-min" disabled={true}>Link Discord</Button>
		{/if}
	</div>
</div>

<!-- language -->
<form method="POST" use:enhance>
	<h2 class="mb-3 text-xl font-bold">Preferences</h2>

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
