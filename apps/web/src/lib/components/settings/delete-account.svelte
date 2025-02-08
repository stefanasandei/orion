<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import Button from '@/components/ui/button/button.svelte';
	import { t } from '@/utils/i18n/translations';
	import { trpc } from '@/utils/trpc/client';
	import { goto, invalidateAll } from '$app/navigation';

	const deleteUser = trpc().user.delete.createMutation({
		onSuccess: async () => {
			await invalidateAll();
			goto('/');
		}
	});

	let open = $state(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button variant="destructive" {...props}>{$t('settings.delete_account')}</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('settings.ru_sure')}</AlertDialog.Title>
			<AlertDialog.Description>
				{$t('settings.deletion_warning')}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('common.cancel')}
			</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => $deleteUser.mutate()}>
				{$t('settings.delete_account')}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
