<script lang="ts">
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { toast } from 'svelte-sonner';
	import { trpc } from '@/utils/trpc/client';
	import { t } from '@/utils/i18n/translations';
	import { invalidateAll } from '$app/navigation';

	let {
		open = $bindable(),
		item
	}: {
		open: boolean;
		item: { id: number; name: string };
	} = $props();

	const deleteNote = trpc().project.deleteNote.createMutation({
		onSuccess: async () => {
			toast($t('project.note_deleted'));
			open = false;
			await invalidateAll();
		},

		onError: () => {
			toast.error($t('project.update_error'));
			open = false;
		}
	});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('settings.ru_sure')}</AlertDialog.Title>
			<AlertDialog.Description>
				{$t('project.delete_note_desc')}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{$t('common.cancel')}</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => $deleteNote.mutate({ noteId: item.id })}>
				{$t('project.delete_note_btn', { default: item.name })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
