<script lang="ts">
	import { Button, buttonVariants } from '@/components/ui/button';
	import { type Writable } from 'svelte/store';
	import { t } from '@/utils/i18n/translations';
	import * as Card from '@/components/ui/card';
	import type { Note } from '@repo/db';
	import ChatBase from './chat-base.svelte';
	import { messages } from './chat-base.svelte';

	export let userInput: Writable<string>;
	export let userId: number;
	export let thought: Note;

	const metadata = JSON.parse(thought.jsonContent) as {
		summary: string;
		questions: string[];
	};
</script>

<ChatBase
	{userInput}
	{userId}
	options={{
		apiEndpoint: `/api/chat/${thought.id}/`,
		maxSteps: 2
	}}
>
	<svelte:fragment slot="pre-messages">
		{#if !$messages?.length}
			<div
				class="mx-auto flex h-full max-w-[85vw] flex-1 flex-col items-center justify-center space-y-6 md:w-full"
			>
				<Card.Root>
					<Card.Header>
						<Card.Title>{$t('dashboard.doc_overview')}</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-muted-foreground text-justify">{metadata.summary}</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="md:w-full">
					<Card.Header>
						<Card.Title>{$t('dashboard.suggested')}</Card.Title>
						<Card.Description>{$t('dashboard.suggested_desc')}</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="grid max-w-[80vw] gap-2">
							{#each metadata.questions as question}
								<Button
									variant="outline"
									class="h-fit max-w-[80vw] justify-start text-balance py-2 text-left"
									onclick={() => {
										$userInput = question;
									}}
								>
									<span class="py-2 md:py-0">{question}</span>
								</Button>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="controls">
		<div class="bg-accent/50 flex w-full flex-row justify-between px-4 py-2">
			<a
				href={thought.textContent}
				target="_blank"
				class={buttonVariants({ variant: 'secondary', size: 'sm' })}
			>
				{$t('dashboard.assistant_page.open_tab')}
			</a>
		</div>
	</svelte:fragment>
</ChatBase>
