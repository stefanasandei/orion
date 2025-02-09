<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import Button from '@/components/ui/button/button.svelte';
	import { t } from '@/utils/i18n/translations';
	import { trpc } from '@/utils/trpc/client';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { activeWorkspaceId, initializeActiveWorkspace } from '../../utils/state';
	import type { UserLocals } from '@repo/core';

	// props
	const { data }: { data: NonNullable<UserLocals["user"]> } = $props();

	// mutations
	const deleteWorkspace = trpc().workspace.delete.createMutation({
		onSuccess: async () => {
			initializeActiveWorkspace(data.workspaces);
			toast('Workspace deleted!');

			await invalidateAll();
			goto('/');
		}
	});

	// state
	let open = $state(false);

	let currentWorkspace = $derived(
		data.workspaces.find((v) => v.id == activeWorkspaceId.current)
	);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Button variant="destructive" {...props}>{$t("settings.delete_workspace")}</Button>
		{/snippet}
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('settings.ru_sure')}</AlertDialog.Title>
			<AlertDialog.Description>
				{$t('settings.delete_workspace_desc', { default: currentWorkspace?.name! })}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('common.cancel')}
			</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => $deleteWorkspace.mutate({ id: currentWorkspace?.id! })}>
				{$t("settings.delete_workspace")}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
