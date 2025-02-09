<script lang="ts">
	import ResponsiveDialog from '@/components/responsive-dialog.svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Icons } from '@/components/icons.svelte';
	import { t } from '@/utils/i18n/translations';
	import { Textarea } from '@/components/ui/textarea';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { trpc } from '@/utils/trpc/client';
	import { activeWorkspaceId } from '@/utils/state';

	let name = $state('');
	let description = $state('');
	let open = $state(false);

	const createProject = trpc().workspace.createProject.createMutation({
		onSuccess: async () => {
			toast.success('Project created!');
			open = false;

			await goto('/', {
				invalidateAll: true,
				replaceState: true
			});
		}
	});
</script>

<ResponsiveDialog
	title={$t('dashboard.create_project')}
	description={$t('dashboard.project_desc')}
	bind:open
>
	{#snippet triggerButton()}
		<Button size="small-icon" variant="ghost"><Icons.add /></Button>
	{/snippet}

	<div class="flex h-full flex-col justify-between">
		<div class="flex flex-col gap-6">
			<div class="grid gap-2">
				<Label for="name">{$t('dashboard.name')}</Label>
				<Input
					id="name"
					bind:value={name}
					placeholder={$t('dashboard.name_placeholder')}
					required
				/>
			</div>
			<div class="grid h-full gap-2">
				<Label for="name">{$t('dashboard.description')}</Label>
				<Textarea
					id="name"
					bind:value={description}
					placeholder={$t('dashboard.description_placeholder')}
					class="h-full"
					required
				/>
			</div>
		</div>

		<Button
			type="submit"
			class="mt-2 w-full"
			onclick={() =>
				$createProject.mutate({
					name: name,
					description: description,
					workspaceId: activeWorkspaceId.current
				})}>{$t('dashboard.create_project_btn')}</Button
		>
	</div>
</ResponsiveDialog>
