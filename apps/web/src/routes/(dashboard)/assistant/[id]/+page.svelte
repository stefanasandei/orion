<script lang="ts">
	import DashboardShell from '@/components/dashboard/shell.svelte';
	import { t } from '@/utils/i18n/translations';
	import type { UserLocals } from '@repo/core';
	import type { UIMessage } from 'ai';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Brain, FileSearch } from 'lucide-svelte';
	import ChatBase from '$base/src/lib/components/assistant/chat-base.svelte';
	import { writable } from 'svelte/store';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { user, conversation } = data;

	console.log(conversation);

	let userInput = writable('');
</script>

<DashboardShell className="flex flex-col h-full" pageName={$t('dashboard.assistant')} {user}>
	<ChatBase
		userId={user.session?.userId!}
		{userInput}
		options={{
			apiEndpoint: '/api/chat/',
			maxSteps: 5,

			// @ts-ignore
			initialMessages: JSON.parse(conversation[0]!.messages.messages ?? [])
		}}
	>
		<svelte:fragment slot="controls">
			<div class="bg-accent/50 flex w-full flex-row justify-between px-4 py-2">
				<Tabs.Root value="chat">
					<Tabs.List class="bg-accent/0 text-accent-foreground space-x-2">
						<Tabs.Trigger
							value="chat"
							class="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
						>
							<Brain class="mr-2 size-5" />
							{$t('dashboard.assistant_page.landing.chat_tab')}
						</Tabs.Trigger>
						<Tabs.Trigger
							value="report"
							disabled
							class="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
						>
							<FileSearch class="mr-2 size-5" />
							{$t('dashboard.assistant_page.landing.report_tab')}
						</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</div>
		</svelte:fragment>
	</ChatBase>
</DashboardShell>
