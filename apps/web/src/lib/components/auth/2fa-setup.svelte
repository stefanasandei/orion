<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import Button from '@/components/ui/button/button.svelte';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';

	/**
	 * Component Props
	 * reset: true if user wants to reset existing 2FA
	 */
	interface Props {
		reset: boolean;
	}
	const { reset }: Props = $props();

	// Dialog control states
	let isOpen = $state(false);
	let showDisableConfirm = $state(false);
	let currentStep = $state(reset ? 'password' : 'qr');

	// Form states
	let code = $state('');
	let password = $state('');
	let passwordError = $state('');
	let isSubmitting = $state(false);

	// TRPC Mutations and Queries
	const setupData = trpc().user.get2FASetupQRCode.createQuery();
	const disable2FA = trpc().user.disable2FA.createMutation();
	const verify2FA = trpc().user.verifyTOTPCode.createMutation();
	const setup2FA = trpc().user.setup2FA.createMutation({
		onSuccess: () => {
			toast.success('2FA enabled successfully');
			isOpen = false;
		}
	});
	const checkPassword = trpc().user.checkPassword.createMutation();

	// Parse QR code SVG for safe rendering
	const qrCode = $derived(
		$setupData.data
			? new DOMParser().parseFromString($setupData.data.qrcode, 'image/svg+xml').documentElement
			: null
	);

	/**
	 * Handler Functions
	 */

	// Verify 2FA code and enable if valid
	const handleVerification = async () => {
		if (!$setupData.data) return;
		isSubmitting = true;

		try {
			const isValidCode = await $verify2FA.mutateAsync({
				code,
				secret: $setupData.data.secret
			});

			if (isValidCode) {
				await $setup2FA.mutate({ secret: $setupData.data.secret });
			} else {
				code = '';
				toast.error('Invalid code, please try again');
			}
		} catch (error) {
			toast.error('Failed to verify code');
		} finally {
			isSubmitting = false;
		}
	};

	// Verify password before allowing 2FA reset
	const handlePasswordVerification = async () => {
		isSubmitting = true;
		passwordError = '';

		try {
			const isValid = await $checkPassword.mutateAsync({ password });
			if (isValid) {
				currentStep = 'qr';
			} else {
				passwordError = 'Invalid password';
			}
		} catch {
			passwordError = 'Something went wrong';
		} finally {
			isSubmitting = false;
		}
	};

	// Disable 2FA with confirmation
	const handleDisable2FA = async () => {
		try {
			await $disable2FA.mutateAsync();
			toast.success('2FA disabled successfully');
		} catch {
			toast.error('Failed to disable 2FA');
		} finally {
			showDisableConfirm = false;
			isOpen = false;
		}
	};
</script>

<!-- Disable 2FA Button & Dialog -->
<div class="flex flex-row gap-4">
	{#if reset}
		<AlertDialog.Root open={showDisableConfirm}>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button variant="destructive" {...props}>Disable 2FA</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Disable two-factor authentication</AlertDialog.Title>
					<AlertDialog.Description>
						Are you sure you want to disable two-factor authentication? This will make your account
						less secure.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel onclick={() => (showDisableConfirm = false)}>
						Cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action disabled={$disable2FA.isPending} onclick={handleDisable2FA}>
						{$disable2FA.isPending ? 'Disabling...' : 'Yes, disable 2FA'}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{/if}

	<!-- Setup/Reset 2FA Dialog -->
	<AlertDialog.Root open={isOpen}>
		<AlertDialog.Trigger>
			{#snippet child({ props })}
				<Button {...props}>{reset ? 'Reset' : 'Setup'} 2FA</Button>
			{/snippet}
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			{#if currentStep === 'password'}
				<!-- Password Verification Step -->
				<AlertDialog.Header>
					<AlertDialog.Title>Verify your password</AlertDialog.Title>
					<AlertDialog.Description>
						Please enter your password to continue with 2FA reset.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<div class="flex flex-col gap-4">
					<div class="flex flex-col gap-2">
						<Label for="password">Password</Label>
						<Input
							id="password"
							type="password"
							bind:value={password}
							placeholder="Enter your password"
							class="w-full"
						/>
						{#if passwordError}
							<p class="text-destructive text-sm">{passwordError}</p>
						{/if}
					</div>
				</div>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action
						disabled={isSubmitting || !password}
						onclick={handlePasswordVerification}
					>
						{isSubmitting ? 'Verifying...' : 'Continue'}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			{:else}
				<!-- QR Code Setup Step -->
				<AlertDialog.Header>
					<AlertDialog.Title>Setup 2 factor authentication</AlertDialog.Title>
					<AlertDialog.Description>
						Scan the QR code using your authenticator app, then enter the 6-digit code to verify.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<div class="flex flex-col gap-6">
					<!-- QR Code Display -->
					<div class="flex justify-center">
						<div class="bg-muted flex h-[300px] w-[300px] items-center justify-center rounded-lg">
							{#if $setupData.isLoading}
								<div class="text-muted-foreground">Loading...</div>
							{:else if qrCode}
								{@html qrCode.outerHTML}
							{/if}
						</div>
					</div>

					<!-- Verification Code Input -->
					<div class="flex flex-col gap-2">
						<Label for="code">Verification Code</Label>
						<Input id="code" bind:value={code} placeholder="Enter 6-digit code" class="w-full" />
					</div>
				</div>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action
						disabled={isSubmitting || code.length !== 6}
						onclick={handleVerification}
					>
						{isSubmitting ? 'Verifying...' : 'Verify & Enable 2FA'}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			{/if}
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>
