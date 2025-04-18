<script lang="ts">
	import HtmlPreview from '../html-preview.svelte';
	import { cn } from '../../utils/cn';
	import { t } from '@/utils/i18n/translations';

	export let msg: { role: 'user' | 'assistant' | 'data' | 'system'; content: string };
</script>

<div class="flex flex-col {msg.role === 'user' ? 'items-end' : 'items-start'}">
	<div
		class={cn('flex items-start gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
	>
		<div class="flex flex-col gap-1 md:max-w-[80%]">
			<div class="text-muted-foreground w-full text-sm">
				{msg.role === 'user'
					? $t('dashboard.assistant_page.chat.you')
					: $t('dashboard.assistant_page.chat.assistant')}
			</div>
			<div
				class={cn(
					'flex w-fit items-start rounded-lg px-4 py-2',
					msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
				)}
			>
				{#if msg.role === 'assistant'}
					<HtmlPreview htmlContent={msg.content} />
				{:else}
					<p>{msg.content}</p>
				{/if}
			</div>
		</div>
	</div>
</div>
