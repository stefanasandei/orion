<script lang="ts">
	import type { User, UserMetadata } from '@repo/db';
	import { Label } from '@/components/ui/label';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { cn } from '@/utils/cn';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { lastVerificationEmailSent } from '@/utils/stores';
	import { onMount } from 'svelte';
	import SetupTwoFactor from '@/components/auth/2fa-setup.svelte';
	import LangPicker from '@/components/lang-picker.svelte';
	import { t } from '@/utils/i18n/translations';

	// component props
	let {
		data
	}: {
		data: {
			userMetadata: UserMetadata;
			user: User;
		};
	} = $props();

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
<h2 class="mb-3 text-xl font-bold">{$t('settings.security')}</h2>
<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div>
			<div class="mb-2 flex flex-row items-center gap-3">
				<Label>{$t('settings.email')}</Label>
				{#if data.userMetadata.emailVerified}
					<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">
						{$t('settings.verified')}
					</p>
				{:else}
					<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">
						{$t('settings.not_verified')}
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
					{$t('settings.send_verification')}
				{:else}
					{`${$t('settings.wait')} ${hoursRemaining} ${hoursRemaining == 1 ? $t('settings.hour') : $t('settings.hours')}`}
				{/if}
			</Button>
		{/if}
	</div>
	<div class="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
		<div class="mb-2 flex flex-row items-center gap-3">
			<Label>{$t('settings.2fa')}</Label>
			{#if data.userMetadata.twoFactorEnabled}
				<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">
					{$t('settings.active')}
				</p>
			{:else}
				<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">
					{$t('settings.not_active')}
				</p>
			{/if}
		</div>
		<SetupTwoFactor reset={data.userMetadata.twoFactorEnabled === true} />
	</div>
</div>

<div>
	<p class="mb-1 text-xl font-bold">{$t('settings.socials')}</p>
	<p class="mb-3">{$t('settings.socials_desc')}</p>
</div>
<div class="flex flex-col gap-6">
	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div class="mb-2 flex flex-row items-center gap-3">
			<Label>{$t('settings.github')}</Label>
			{#if data.user.githubId !== null}
				<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">
					{$t('settings.linked')}
				</p>
			{:else}
				<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">
					{$t('settings.not_linked')}
				</p>
			{/if}
		</div>

		{#if data.user.githubId === null}
			<a href="/login/github" class={cn(buttonVariants({ size: 'sm' }), 'w-min')}
				>{$t('settings.link')} {$t('settings.github')}</a
			>
		{/if}
	</div>

	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div class="mb-2 flex flex-row items-center gap-3">
			<Label>{$t('settings.discord')}</Label>
			{#if false}
				<p class="bg-primary text-primary-foreground rounded-sm p-1 text-sm">
					{$t('settings.linked')}
				</p>
			{:else}
				<p class="bg-destructive text-destructive-foreground rounded-sm p-1 text-sm">
					{$t('settings.not_available')}
				</p>
			{/if}
		</div>

		{#if !false}
			<Button size="sm" class="w-min" disabled={true}
				>{$t('settings.link')} {$t('settings.discord')}</Button
			>
		{/if}
	</div>
</div>

<!-- language -->
<div>
	<h2 class="mb-3 text-xl font-bold">{$t('settings.preferences')}</h2>

	<LangPicker />
</div>
