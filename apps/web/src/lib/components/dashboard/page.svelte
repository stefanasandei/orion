<script lang="ts">
	import type { User, UserMetadata } from '@repo/db';
	import { Button, buttonVariants } from '@/components/ui/button';
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

{#if user.githubId == null}
	<a href="/login/github" class={buttonVariants({ variant: 'outline' })}>Link your GitHub account</a
	>
{:else}
	<p>your github account: {user.githubId}</p>
{/if}

<p>Hello, {metadata.name}!</p>
