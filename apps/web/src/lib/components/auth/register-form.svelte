<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import * as Form from '@/components/ui/form';

	import { enhance } from '$app/forms';

	interface Props {
		form: {
			message: string;
			email: string;
			name: string;
		} | null;
	}

	let { form }: Props = $props();
</script>

<!-- <h1>register</h1>
<form method="post" use:enhance>
	<input placeholder="name" name="name" type="text" required value={form?.name ?? ''} /> <br />
	<input placeholder="email" name="email" type="email" required value={form?.email ?? ''} /> <br />
	<input placeholder="password" name="password" type="password" required /><br />
	<button>submit</button>
	<p>{form?.message ?? ''}</p>
</form> -->

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" class="grid gap-4" use:enhance>
			<div class="grid grid-cols-2 gap-4">
				<Form.Field {form} class="grid gap-2">
					<Form.Control>
						<Form.Label for="first-name">First name</Form.Label>
						<Input id="first-name" placeholder="Max" required />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<div class="grid gap-2">
					<Label for="last-name">Last name</Label>
					<Input id="last-name" placeholder="Robinson" required />
				</div>
			</div>
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" placeholder="m@example.com" required />
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input id="password" type="password" />
			</div>
			<Button type="submit" class="w-full">Create an account</Button>

			<div class="flex w-full items-center gap-2">
				<div class="bg-muted h-px w-full"></div>
				<div class="text-muted-foreground">or</div>
				<div class="bg-muted h-px w-full"></div>
			</div>

			<Button variant="outline" class="w-full">Sign up with GitHub</Button>
		</form>
		<div class="mt-4 text-center text-sm">
			Already have an account?
			<a href="##" class="underline"> Sign in </a>
		</div>
	</Card.Content>
</Card.Root>
