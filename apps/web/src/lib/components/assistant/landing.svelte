<script lang="ts">
	import { Brain, FileSearch } from 'lucide-svelte';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { t } from '@/utils/i18n/translations';
	import { type Writable } from 'svelte/store';
	import { Icons } from '../icons.svelte';

	export let state: Writable<'landing' | 'chat'>;
	export let userInput: Writable<string>;

	let landingInput = '';

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!landingInput.trim()) return;

		userInput.set(landingInput);
		state.set('chat');
	}
</script>

<div class="flex h-full w-full flex-col">
	<main class="flex flex-1 items-center justify-center p-4">
		<div class="flex w-full max-w-3xl flex-col justify-center gap-6">
			<h2 class="text-center text-2xl font-semibold md:text-4xl">
				{$t('dashboard.assistant_page.landing.title')}
			</h2>

			<form
				on:submit={handleSubmit}
				class="bg-accent/50 flex flex-col gap-6 rounded-xl p-4 shadow-sm"
			>
				<Input
					bind:value={landingInput}
					class="bg-accent/0 flex-1 border-0 ring-0 ring-offset-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
					placeholder={$t('dashboard.assistant_page.landing.input_placeholder')}
				/>

				<div class="-mb-0 flex flex-row items-center justify-between">
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

					<Button type="submit" variant="secondary" size="small-icon">
						<Icons.send />
					</Button>
				</div>
			</form>
		</div>
	</main>

	<footer class="p-4">
		<p class="text-muted-foreground text-center text-sm">
			{$t('dashboard.assistant_page.landing.footer_text')}
		</p>
	</footer>
</div>
