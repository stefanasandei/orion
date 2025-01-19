<script lang="ts">
	import type { User, UserMetadata } from '@repo/db';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/utils/trpc/client';
	import { goto } from '$app/navigation';

	interface Props {
		user: User;
		metadata: UserMetadata;
	}

	const { metadata, user }: Props = $props();

	const logout = trpc().user.logout.createMutation({
		onSuccess: async () => {
			await goto('/login', { invalidateAll: true });
		}
	});
</script>

<p>Hello, {metadata.name}!</p>

<Button onclick={() => $logout.mutate()}>Logout</Button>
