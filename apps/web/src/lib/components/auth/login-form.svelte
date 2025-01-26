<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import * as Form from '@/components/ui/form';
	import { Checkbox } from '@/components/ui/checkbox';
	import { type LoginFormSchema } from '../../../routes/(auth)/login/schema';
	import { type SuperForm, type Infer } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';
	import { Icons } from '@/components/icons.svelte';

	interface Props {
		form: SuperForm<Infer<LoginFormSchema>>;
	}

	let { form }: Props = $props();
	const { form: formData, message } = form;

	let showPassword = $state(false);
</script>

<Card.Root class="border-border mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">Login</Card.Title>
		<Card.Description>Enter your credentials to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" class="grid gap-4" use:enhance>
			<Form.Field {form} name="email" class="grid">
				<Form.Control>
					<Form.Label for="email">Email</Form.Label>
					<Input id="email" type="email" name="email" placeholder="john@example.com" required />
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password" class="grid">
				<Form.Control>
					<Form.Label for="password">Password</Form.Label>
					<div class="flex flex-row gap-4">
						<Input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							required
						/>
						<Button
							variant="outline"
							size="icon"
							type="button"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<Icons.hide />
							{:else}
								<Icons.show />
							{/if}
						</Button>
					</div>
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="rememberMe" class="grid">
				<Form.Control>
					<div class="flex flex-row items-center gap-4">
						<Checkbox id="rememberMe" bind:checked={$formData.rememberMe} name="rememberMe" />
						<Form.Label for="rememberMe">Remember me</Form.Label>
					</div>
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>

			{#if $message}
				<div class="text-destructive-foreground bg-destructive rounded-md p-3 text-sm">
					{$message.failMessage}
				</div>
				<!-- <p>{$message.reason}</p> -->
			{/if}

			<Button type="submit" class="w-full">Login</Button>

			<div class="flex w-full items-center gap-2">
				<div class="bg-muted h-px w-full"></div>
				<div class="text-muted-foreground">or</div>
				<div class="bg-muted h-px w-full"></div>
			</div>

			<a href="/login/github" class={buttonVariants({ variant: 'outline' })}> Login with GitHub </a>
		</form>
		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="/register" class="underline">Sign up</a>
		</div>
	</Card.Content>
</Card.Root>
