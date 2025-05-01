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
	import DeleteAccount from '@/components/settings/delete-account.svelte';
	import DeleteWorkspace from '@/components/settings/delete-workspace.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import { Switch } from '@/components/ui/switch';

	// @ts-ignore
	import { hasAIEnabled } from '@repo/api/enabled-ai';

	// component props
	let {
		data
	}: {
		data: { user: UserLocals };
	} = $props();

	const user = data.user.user!;

	// utility functions
	const sendConfirmationEmail = trpc().user.sendConfirmationEmail.createMutation({
		onSuccess: () => {
			toast.success(t.get('settings.confirmation_email_sent'));
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

<div class="max-w-4xl space-y-8">
	<!-- Security Section -->
	<div class="rounded-lg border-2 p-6">
		<h2 class="mb-6 text-2xl font-semibold">{$t('settings.security')}</h2>

		<div class="space-y-6">
			<!-- Email Section -->
			<div class="bg-muted/25 relative overflow-hidden rounded-lg border p-6 transition-all">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<Label class="text-lg">{$t('settings.email')}</Label>
							{#if user.metadata.emailVerified}
								<span
									class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
								>
									{$t('settings.verified')}
								</span>
							{:else}
								<span
									class="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
								>
									{$t('settings.not_verified')}
								</span>
							{/if}
						</div>
						<p class="text-muted-foreground">{user.metadata.email}</p>
					</div>

					{#if !user.metadata.emailVerified}
						<Button
							variant="secondary"
							onclick={() => $sendConfirmationEmail.mutate()}
							disabled={!canSendEmail}
							class="w-full md:w-auto"
						>
							{#if !cooldownCalculated}
								<span class="animate-pulse">Loading...</span>
							{:else if canSendEmail}
								{$t('settings.send_verification')}
							{:else}
								{`${$t('settings.wait')} ${hoursRemaining} ${hoursRemaining == 1 ? $t('settings.hour') : $t('settings.hours')}`}
							{/if}
						</Button>
					{/if}
				</div>
			</div>

			<!-- 2FA Section -->
			<div class="bg-muted/25 relative overflow-hidden rounded-lg border p-6 transition-all">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<Label class="text-lg">{$t('settings.2fa')}</Label>
							{#if user.metadata.twoFactorEnabled}
								<span
									class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
								>
									{$t('settings.active')}
								</span>
							{:else}
								<span
									class="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
								>
									{$t('settings.not_active')}
								</span>
							{/if}
						</div>
						<p class="text-muted-foreground">
							Two-factor authentication enhaces your account security.
						</p>
					</div>
					<SetupTwoFactor reset={user.metadata.twoFactorEnabled === true} />
				</div>
			</div>
		</div>
	</div>

	<!-- Social Links Section -->
	<div class="rounded-lg border-2 p-6">
		<h2 class="mb-6 text-2xl font-semibold">{$t('settings.socials')}</h2>

		<p class="text-muted-foreground mb-6">{$t('settings.socials_desc')}</p>

		<div class="space-y-4">
			<!-- GitHub -->
			<div
				class="bg-muted/25 flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center md:justify-between"
			>
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor">
							<path
								d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
							/>
						</svg>
						<Label class="text-lg">{$t('settings.github')}</Label>
						{#if user.intern.githubId !== null}
							<span
								class="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
							>
								✓ {$t('settings.linked')}
							</span>
						{:else}
							<span
								class="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
							>
								! {$t('settings.not_linked')}
							</span>
						{/if}
					</div>
				</div>

				{#if user.intern.githubId === null}
					<a
						href="/login/github"
						class={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							'flex w-full items-center gap-2 md:w-auto'
						)}
					>
						<svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor">
							<path
								d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
							/>
						</svg>
						{$t('settings.link')}
						{$t('settings.github')}
					</a>
				{/if}
			</div>

			<!-- Discord -->
			<div
				class="bg-muted/25 flex flex-col gap-4 rounded-md border p-4 md:flex-row md:items-center md:justify-between"
			>
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<svg class="h-5 w-5" viewBox="0 -28.5 256 256" fill="currentColor">
							<path
								d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
							/>
						</svg>
						<Label class="text-lg">{$t('settings.discord')}</Label>
						<span
							class="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
						>
							{$t('settings.not_available')}
						</span>
					</div>
				</div>

				<Button
					variant="outline"
					size="sm"
					class="flex w-full items-center gap-2 md:w-auto"
					disabled={true}
				>
					<svg class="h-4 w-4" viewBox="0 -28.5 256 256" fill="currentColor">
						<path
							d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
						/>
					</svg>
					{$t('settings.link')}
					{$t('settings.discord')}
				</Button>
			</div>
		</div>
	</div>

	<!-- Preferences Section -->
	<div class="space-y-8 rounded-lg border-2 p-6">
		<div class="mb-6 flex items-center gap-2">
			<h2 class="text-2xl font-semibold">{$t('settings.preferences')}</h2>
		</div>

		<div class="bg-muted/25 relative overflow-hidden rounded-lg border p-6 transition-all">
			<div class="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<Label class="text-lg">{'Language'}</Label>
					</div>
				</div>

				<LangPicker />
			</div>
		</div>

		<div class="bg-muted/25 relative overflow-hidden rounded-lg border p-6 transition-all">
			<div class="flex flex-col gap-12 md:flex-row md:items-center md:justify-between">
				<div class="space-y-1">
					<div class="flex items-center gap-2">
						<Label class="text-lg">{'Enable AI features'}</Label>
						<span
							class="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
						>
							{'requires payment'}
						</span>
					</div>
				</div>

				<Switch checked={hasAIEnabled(user.intern.id)} disabled={true} />
			</div>
		</div>
	</div>

	<!-- Danger Zone -->
	<div class="border-destructive/50 bg-destructive/5 rounded-lg border-2 p-6">
		<div class="mb-6 flex items-center gap-2">
			<h2 class="text-destructive text-2xl font-semibold">{$t('settings.danger_zone')}</h2>
		</div>
		<div class="space-y-4">
			<DeleteAccount />
			<DeleteWorkspace data={data.user.user!} />
		</div>
	</div>
</div>
