<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '@/utils/i18n/translations';
	import * as Card from '@/components/ui/card';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { Search, MessageSquare, Calendar, ArrowRight } from 'lucide-svelte';
	import { Badge } from '@/components/ui/badge';

	const {
		userId,
		conversations
	}: { userId: number; conversations: { id: string; name?: string }[] } = $props();

	let searchQuery = $state('');
	let filteredConversations = $derived(
		conversations.filter((conv) =>
			(conv.name || '').toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<div
	class="no-scrollbar mx-auto flex h-full w-full max-w-4xl flex-1 flex-col space-y-12 overflow-y-auto px-1"
>
	<!-- Header section -->
	<div class="flex flex-col gap-4">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-semibold tracking-tight">Your conversations</h1>
			<Button onclick={() => goto('/assistant')}>New Chat</Button>
		</div>

		<!-- Search bar -->
		<Input type="text" placeholder="Search conversations..." bind:value={searchQuery} />
	</div>

	<!-- Conversations grid -->
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredConversations as conversation (conversation.id)}
			<Card.Root class="hover:bg-muted/50 group relative transition-all">
				<a
					href={`/assistant/${conversation.id}`}
					class="absolute inset-0"
					aria-label={`Open conversation: ${conversation.name || 'Untitled Conversation'}`}
				></a>
				<Card.Content class="p-6">
					<div class="flex flex-col gap-4">
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-2">
								<MessageSquare class="h-5 w-5" />
								<span class="font-medium">
									{conversation.name || 'Untitled Conversation'}
								</span>
							</div>
							<Badge variant="secondary" class="hidden group-hover:inline-flex">View</Badge>
						</div>

						<div class="text-muted-foreground flex items-center gap-2 text-sm">
							<Calendar class="h-4 w-4" />
							<span>Today</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	{#if filteredConversations.length === 0}
		<div class="flex flex-col items-center justify-center gap-4 p-8">
			<div class="text-muted-foreground text-center">
				{searchQuery ? 'No conversations found matching your search' : 'No conversations yet'}
			</div>
			<Button onclick={() => goto('/assistant')}>
				Start a new chat
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
	{/if}
</div>
