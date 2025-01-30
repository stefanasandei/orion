<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import Button from '@/components/ui/button/button.svelte';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { trpc } from '@/utils/trpc/client';
	import { toast } from 'svelte-sonner';

	let isOpen = $state(true);

	const setupData = trpc().user.get2FASetupQRCode.createQuery();
	const verify2FA = trpc().user.verifyTOTPCode.createMutation();
	const setup2FA = trpc().user.setup2FA.createMutation({
		onSuccess: () => {
			toast.success('2FA enabled successfully');
			isOpen = false;
		}
	});

	// Parse SVG string into HTML for safe rendering
	const qrCode = $derived(
		$setupData.data
			? new DOMParser().parseFromString($setupData.data.qrcode, 'image/svg+xml').documentElement
			: null
	);

	let code = $state('');
	let isSubmitting = $state(false);

	const handleVerification = async () => {
		isSubmitting = true;

		if ($setupData.data === undefined) {
			isSubmitting = false;
			return;
		}

		const isValidCode = await $verify2FA.mutateAsync({ code, secret: $setupData.data.secret });
		if (!isValidCode) {
			code = '';
			toast.error('Invalid code, please try again');
		} else {
			$setup2FA.mutate({ secret: $setupData.data.secret });
		}

		isSubmitting = false;
	};
</script>

<AlertDialog.Root open={isOpen}>
	<AlertDialog.Trigger>
		<Button>Setup 2FA</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Setup 2 factor authentication</AlertDialog.Title>
			<AlertDialog.Description>
				Scan the QR code using your authenticator app, afterwards enter the 6 digits code to verify.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<div class="flex flex-col gap-6">
			<div class="flex justify-center">
				<div class="bg-muted flex h-[300px] w-[300px] items-center justify-center rounded-lg">
					{#if $setupData.isLoading}
						<div class="text-muted-foreground">Loading...</div>
					{:else if qrCode}
						{@html qrCode.outerHTML}
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="code">Verification Code</Label>
				<Input id="code" bind:value={code} placeholder="Enter 6-digit code" class="w-full" />
			</div>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action disabled={isSubmitting || code.length !== 6} onclick={handleVerification}>
				{isSubmitting ? 'Verifying...' : 'Verify & Enable 2FA'}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
