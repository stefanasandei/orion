<script lang="ts">
	import { type Writable } from 'svelte/store';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Brain, FileSearch } from 'lucide-svelte';
	import { t } from '@/utils/i18n/translations';
	import ChatBase from './chat-base.svelte';

	export let userInput: Writable<string>;
	export let userId: number;
</script>

<ChatBase
	{userInput}
	{userId}
	options={{
		apiEndpoint: '/api/chat/',
		maxSteps: 5
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
