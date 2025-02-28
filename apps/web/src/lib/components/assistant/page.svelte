<script lang="ts">
	import { Brain, FileSearch, Globe } from 'lucide-svelte';
	import { Icons } from '../icons.svelte';
	import Button from '../ui/button/button.svelte';
	import Input from '../ui/input/input.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	interface Props {
		user: { id: number };
	}

	const { user }: Props = $props();

	const state = $state<'landing' | 'chat'>('landing');

	// mock data
	const messages = [
		{ role: 'bot', content: 'Hello! How can I help you today?' },
		{ role: 'user', content: 'Can you help me analyze my sales data?' },
		{
			role: 'bot',
			content:
				'Of course! I can help you analyze your sales data. Please upload your data or ask specific questions about existing data.'
		},
		{ role: 'user', content: 'What were our top selling products last month?' },
		{
			role: 'bot',
			content:
				'Based on the available data, your top selling products last month were:\n1. Product A - 1,200 units\n2. Product B - 850 units\n3. Product C - 720 units'
		}
	];

	function formatMessageContent(content: string) {
		return content.split('\n').join('<br>');
	}
</script>

{#if state == 'landing'}
	<div class="flex h-full w-full flex-col">
		<main class="flex flex-1 items-center justify-center p-4">
			<div class="flex w-full max-w-3xl flex-col justify-center gap-6">
				<h2 class="text-center text-2xl font-semibold md:text-4xl">What would you want to know?</h2>

				<div class="bg-accent/50 flex flex-col gap-6 rounded-xl p-4 shadow-sm">
					<Input
						class="bg-accent/0 flex-1 border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
						placeholder="Ask me anything..."
					/>

					<div class="-mb-0 flex flex-row items-center justify-between">
						<Tabs.Root value="chat">
							<Tabs.List class="bg-accent/0 text-accent-foreground space-x-2">
								<Tabs.Trigger
									class="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
									value="chat"
								>
									<Brain class="mr-2 size-5" />
									Chat
								</Tabs.Trigger>
								<Tabs.Trigger
									class="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
									value="report"
								>
									<FileSearch class="mr-2 size-5" />
									Report
								</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>

						<Button variant="secondary" size="small-icon">
							<Icons.send />
						</Button>
					</div>
				</div>
			</div>
		</main>

		<footer class="p-4">
			<p class="text-muted-foreground text-center text-sm">
				<!-- todo: better text -->
				Chat with your documents, search using natural language. Powered by an LLM.
			</p>
		</footer>
	</div>
{:else}
	<div class="flex h-full max-h-[94svh] w-full flex-col justify-between gap-4 p-4 md:max-h-[98svh]">
		<div class="flex-1 space-y-6 overflow-y-auto px-1 md:px-4">
			{#each messages as message}
				<div class="flex flex-col {message.role === 'user' ? 'items-end' : 'items-start'}">
					<div
						class="flex items-start gap-2.5 {message.role === 'user'
							? 'flex-row-reverse'
							: 'flex-row'}"
					>
						<div class="flex flex-col gap-1 md:max-w-[80%]">
							<div
								class={'text-muted-foreground w-full text-sm ' +
									(message.role === 'user' ? 'text-right' : 'text-left')}
							>
								{message.role === 'user' ? 'You' : 'Assistant'}
							</div>
							<div
								class="rounded-lg {message.role === 'user'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted'} px-4 py-2"
							>
								{@html formatMessageContent(message.content)}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="bg-background border-t pt-4">
			<div class="bg-accent/50 flex items-center gap-2 rounded-xl p-4 shadow-sm">
				<Input
					class="bg-accent/0 flex-1 border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder="Type a message..."
				/>
				<Button variant="default" size="sm">
					<Icons.send class="size-4" />
				</Button>
			</div>
		</div>
	</div>
{/if}
