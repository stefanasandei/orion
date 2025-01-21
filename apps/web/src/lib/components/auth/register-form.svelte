<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import * as Form from '@/components/ui/form';
	import { type RegisterFormSchema } from '../../../routes/(auth)/register/schema';
	import { type SuperForm, type Infer } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';

	interface Props {
		form: SuperForm<Infer<RegisterFormSchema>>;
	}

	let { form }: Props = $props();
</script>

<Card.Root class="border-border mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">Register</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" class="grid gap-4" use:enhance>
			<div class="grid grid-cols-2 gap-4">
				<Form.Field {form} name="firstName" class="grid">
					<Form.Control>
						<Form.Label for="first-name">First name</Form.Label>
						<Input id="first-name" name="firstName" placeholder="Max" required />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="lastName" class="grid">
					<Form.Control>
						<Form.Label for="last-name">Last name</Form.Label>
						<Input id="last-name" name="lastName" placeholder="Robinson" required />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
			</div>
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
					<Input id="password" name="password" type="password" />
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<Button type="submit" class="w-full">Create an account</Button>

			<div class="flex w-full items-center gap-2">
				<div class="bg-muted h-px w-full"></div>
				<div class="text-muted-foreground">or</div>
				<div class="bg-muted h-px w-full"></div>
			</div>

			<Button variant="outline" class="w-full">Register with GitHub</Button>
		</form>
		<div class="mt-4 text-center text-sm">
			Already have an account?
			<a href="/login" class="underline"> Sign in </a>
		</div>
	</Card.Content>
</Card.Root>
