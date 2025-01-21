<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import * as Form from '@/components/ui/form';
	import { type LoginFormSchema } from '../../../routes/(auth)/login/schema';
	import { type SuperForm, type Infer } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';

	interface Props {
		form: SuperForm<Infer<LoginFormSchema>>;
	}

	let { form }: Props = $props();
	const { message } = form;
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
					<Input id="password" name="password" type="password" required />
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>

			{#if $message}
				<div class="text-destructive bg-destructive/10 rounded-md p-3 text-sm">
					{$message}
				</div>
			{/if}

			<Button type="submit" class="w-full">Login</Button>

			<div class="flex w-full items-center gap-2">
				<div class="bg-muted h-px w-full"></div>
				<div class="text-muted-foreground">or</div>
				<div class="bg-muted h-px w-full"></div>
			</div>

			<Button variant="outline" class="w-full">Login with GitHub</Button>
		</form>
		<div class="mt-4 text-center text-sm">
			Don't have an account?
			<a href="/register" class="underline">Sign up</a>
		</div>
	</Card.Content>
</Card.Root>
