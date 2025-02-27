<script lang="ts">
	import type { ProjectPost, Comment } from '@repo/db';
	import { t } from '../../utils/i18n/translations';
	import { Separator } from '../ui/separator';
	import { Input } from '../ui/input';
	import Button from '../ui/button/button.svelte';
	import { trpc } from '../../utils/trpc/client';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		post: ProjectPost & { comments: Comment[] };
	}

	const { post }: Props = $props();

	// add new comment logic
	let commentText = $state('');

	const createComment = trpc().project.addCommentToPublicPost.createMutation({
		onSuccess: async () => {
			toast.success('Comment added!');
			commentText = '';
			await invalidateAll();
		}
	});

	const handleEnter = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && commentText.trim()) {
			$createComment.mutate({
				content: commentText,
				postId: post.id
			});
		}
	};
</script>

<div class="mt-4 md:mx-auto md:max-w-5xl">
	<div>
		<p class="mb-2 text-2xl">Comments</p>
		<Separator class="mb-2" />
	</div>

	<!-- add new comment -->
	<div class="flex flex-row gap-2">
		<Input bind:value={commentText} placeholder="Write a comment..." onkeydown={handleEnter} />
		<Button
			onclick={() =>
				$createComment.mutate({
					content: commentText,
					postId: post.id
				})}>Post</Button
		>
	</div>

	<!-- comments list -->
	<div class="flex flex-col gap-4">
		{#each post.comments as comment}
			<p>{comment.content}</p>
		{/each}
	</div>
</div>
