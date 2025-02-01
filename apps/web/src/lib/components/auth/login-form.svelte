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
	import { browser } from '$app/environment';
	import { PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public';
	import { t } from '@/utils/i18n/translations';

	interface Props {
		form: SuperForm<Infer<LoginFormSchema>>;
	}

	let { form }: Props = $props();
	const { form: formData, message } = form;

	let showPassword = $state(false);
	let recaptchaWidget = $state<number | null>(null);
	let captchaSolved = $state(false);

	$effect(() => {
		if (!browser) return;

		if ($message?.reason === 5) {
			const renderRecaptcha = () => {
				// Give DOM time to update
				setTimeout(() => {
					if (window.grecaptcha) {
						if (recaptchaWidget !== null) {
							window.grecaptcha.reset(recaptchaWidget);
						} else {
							recaptchaWidget = window.grecaptcha.render('recaptcha', {
								sitekey: PUBLIC_RECAPTCHA_SITE_KEY,
								callback: (response: string) => {
									captchaSolved = !!response;
								},
								'expired-callback': () => {
									captchaSolved = false;
								},
								'error-callback': () => {
									captchaSolved = false;
								}
							});
						}
					} else {
						// Retry until grecaptcha loads
						setTimeout(renderRecaptcha, 100);
					}
				}, 0);
			};

			renderRecaptcha();
		} else {
			// Reset captcha when not needed
			if (recaptchaWidget !== null) {
				window.grecaptcha?.reset(recaptchaWidget);
			}
			captchaSolved = false;
		}
	});

	function handleSubmit(e: SubmitEvent) {
		if (browser && $message?.reason === 5) {
			if (!captchaSolved || !window.grecaptcha) {
				e.preventDefault();
				return;
			}

			const response = window.grecaptcha.getResponse(recaptchaWidget!);
			if (!response) {
				e.preventDefault();
				captchaSolved = false;
			}
		}
	}
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<Card.Root class="border-border text-foreground mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-xl">{$t('auth.login')}</Card.Title>
		<Card.Description>{$t('auth.login_desc')}</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" class="grid gap-4" onsubmit={handleSubmit} use:enhance>
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

			<Form.Field {form} name="rememberMe" class="grid">
				<Form.Control>
					<div class="flex flex-row items-center gap-4">
						<Checkbox id="rememberMe" bind:checked={$formData.rememberMe} name="rememberMe" />
						<Form.Label for="rememberMe">{$t('auth.remember_me')}</Form.Label>
					</div>
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>

			{#if $message?.reason === 5}
				<div class="g-recaptcha" id="recaptcha" data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}></div>
			{/if}

			{#if $message}
				<div class="text-destructive-foreground bg-destructive rounded-md p-3 text-sm">
					{$message.failMessage}
				</div>
			{/if}

			<Button type="submit" class="w-full" disabled={$message?.reason === 5 && !captchaSolved}>
				{$t('auth.login')}
			</Button>

			<div class="flex w-full items-center gap-2">
				<div class="bg-muted h-px w-full"></div>
				<div class="text-muted-foreground">{$t('common.or')}</div>
				<div class="bg-muted h-px w-full"></div>
			</div>

			<a href="/login/github" class={buttonVariants({ variant: 'outline' })}>{$t('auth.github')}</a>
		</form>
		<div class="mt-4 text-center text-sm">
			{$t('auth.no_acc')}
			<a href="/register" class="underline">{$t('auth.register')}</a>
		</div>
	</Card.Content>
</Card.Root>
