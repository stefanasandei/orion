<script lang="ts">
	import { trpc } from '@/utils/trpc/client';
	import FormScreen from '@/components/form-screen.svelte';

	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import type { UserLocals } from '@repo/core';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { t } from '@/utils/i18n/translations';
	import { activeWorkspaceId } from '$base/src/lib/utils/state';

	let { data }: { data: { user: UserLocals } } = $props();
	const user = data.user.user!;

	let name = $state('');

	const createWorkspace = trpc().workspace.create.createMutation({
		onSuccess: async (data) => {
			activeWorkspaceId.current = data[0].id;
			await invalidateAll();
			toast.success(t.get('dashboard.workspace_created'));
			goto('/');
		}
	});
</script>

<FormScreen userEmail={user.metadata.email}>
	<Card.Root class="text-foreground mx-auto h-min max-w-xl">
		<Card.Header>
			<Card.Title class="mb-2 text-center text-3xl"
				>{$t('dashboard.create_new_workspace')}</Card.Title
			>
			<Card.Description class="mb-2 text-center">{$t('dashboard.workspace_desc')}</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="name">{$t('dashboard.name')}</Label>
					<Input id="name" bind:value={name} placeholder={$t('dashboard.school_work')} required />
				</div>
				<Button
					type="submit"
					class="mt-2 w-full"
					onclick={() =>
						$createWorkspace.mutate({
							name
						})}>{$t('dashboard.create_workspace_btn')}</Button
				>
			</div>
		</Card.Content>
	</Card.Root>
</FormScreen>
