<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import * as Form from '@/components/ui/form';
	import { type RegisterFormSchema } from '../../../routes/(auth)/register/schema';
	import { type SuperForm, type Infer } from 'sveltekit-superforms';
	import { enhance } from '$app/forms';
	import { Icons } from '@/components/icons.svelte';
	import { t } from '@/utils/i18n/translations';

	interface Props {
		form: SuperForm<Infer<RegisterFormSchema>>;
	}

	let { form }: Props = $props();

	let showPassword = $state(false);
</script>

<Card.Root class="border-border text-foreground mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">{$t('auth.register')}</Card.Title>
		<Card.Description>{$t('auth.register_desc')}</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" class="grid gap-4" use:enhance>
			<div class="grid grid-cols-2 gap-4">
				<Form.Field {form} name="firstName" class="grid">
					<Form.Control>
						<Form.Label for="first-name">{$t('auth.first_name')}</Form.Label>
						<Input id="first-name" name="firstName" placeholder="Andrei" required />
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="lastName" class="grid">
					<Form.Control>
						<Form.Label for="last-name">{$t('auth.last_name')}</Form.Label>
						<Input id="last-name" name="lastName" placeholder="Popescu" required />
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
					<Form.Label for="password">{$t('auth.password')}</Form.Label>
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
			<Button type="submit" class="w-full">{$t('auth.create_account')}</Button>

			<div class="flex w-full items-center gap-2">
				<div class="bg-muted h-px w-full"></div>
				<div class="text-muted-foreground">{$t('common.or')}</div>
				<div class="bg-muted h-px w-full"></div>
			</div>

			<a href="/login/github" class={buttonVariants({ variant: 'outline' })}>
				{$t('auth.github')}
			</a>
		</form>
		<div class="mt-4 text-center text-sm">
			{$t('auth.has_acc')}
			<a href="/login" class="underline"> {$t('auth.login')} </a>
		</div>
	</Card.Content>
</Card.Root>
