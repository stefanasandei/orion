<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2">
					<Label for="first-name">First name</Label>
					<Input id="first-name" placeholder="Max" required />
				</div>
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
		</div>
		<div class="mt-4 text-center text-sm">
			Already have an account?
			<a href="##" class="underline"> Sign in </a>
		</div>
	</Card.Content>
</Card.Root>
