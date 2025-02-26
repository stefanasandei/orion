<script lang="ts">
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import { Button } from '@/components/ui/button';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { toast } from 'svelte-sonner';
	import { trpc } from '@/utils/trpc/client';
	import { t } from '@/utils/i18n/translations';

	let {
		item
	}: {
		item: { id: number; name: string };
	} = $props();

	const deleteProject = trpc().project.delete.createMutation({
		onSuccess: async () => {
			toast($t('project.deleted_msg'));
			open = false;
			location.reload();
		}
	});

	let open = $state(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class="w-full outline-none">
		<Button size="sm" variant="ghost" class="w-full">
			<Trash2 class="text-muted-foreground" />
			<span>{$t('settings.delete_project')}</span>
		</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('settings.ru_sure')}</AlertDialog.Title>
			<AlertDialog.Description>
				{$t('settings.delete_project_desc')}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{$t('common.cancel')}</AlertDialog.Cancel>
			<AlertDialog.Action onclick={() => $deleteProject.mutate({ id: item.id })}>
				{$t('settings.delete_project_warning', { default: item.name })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
