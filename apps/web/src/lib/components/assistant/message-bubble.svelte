<script lang="ts">
	import HtmlPreview from '../html-preview.svelte';
	import { cn } from '../../utils/cn';
	import { t } from '@/utils/i18n/translations';
	import Button from '../ui/button/button.svelte';
	import { Icons } from '../icons.svelte';
	import { toast } from 'svelte-sonner';
	import { parse } from 'marked';
	import type { UIMessage } from 'ai';

	export let msg: UIMessage;
	export let isStreaming: boolean;

	$: cachedHtml = new Map();

	function renderHtml(content: string) {
		if (cachedHtml.has(content)) {
			return cachedHtml.get(content)!;
		}

		// don't rerender everytime
		// TODO: perf issue
		if (isStreaming) {
		} //return;

		const rendered = parse(content, {
			async: false
		}) as string;

		cachedHtml.set(content, rendered);

		return rendered;
	}
</script>

{#if msg.role == 'user'}
	<div class="flex justify-end">
		<div
			class="border-primary/80 bg-primary/80 group relative inline-block max-w-[80%] break-words rounded-xl border px-4 py-3 text-left"
		>
			<HtmlPreview className="text-primary-foreground" htmlContent={renderHtml(msg.content)} />

			{@render userControls(msg)}
		</div>
	</div>
{:else}
	<div class="flex justify-start">
		<div class="group relative w-full max-w-full space-y-2 break-words">
			{#each msg.parts as part}
				{#if part.type === 'text'}
					<HtmlPreview htmlContent={renderHtml(msg.content)} />

					{@render botControls(msg)}
				{:else if part.type === 'reasoning'}
					<p class="text-muted-foreground font-light">
						{msg.content}
					</p>
				{:else if part.type === 'tool-invocation'}
					<span class="font-light">
						{`${$t('dashboard.assistant_page.copied')}: ` + msg.toolInvocations?.[0].toolName}
					</span>
				{/if}
			{/each}
		</div>
	</div>
{/if}

{#snippet userControls(message: UIMessage)}
	<div
		class="absolute right-0 mt-5 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
	>
		<Button
			size="sm"
			onclick={() => {
				navigator.clipboard.writeText(message.content);
				toast.success($t('dashboard.assistant_page.copied'), {
					position: 'bottom-right'
				});
			}}
			variant={'ghost'}
		>
			<Icons.copy />
		</Button>
	</div>
{/snippet}

{#snippet botControls(message: UIMessage)}
	<div
		class="absolute left-0 -ml-0.5 mt-2 flex items-center gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
	>
		<Button
			size="sm"
			onclick={() => {
				navigator.clipboard.writeText(message.content);
				toast.success($t('dashboard.assistant_page.copied'), {
					position: 'bottom-right'
				});
			}}
			variant={'ghost'}
		>
			<Icons.copy />
		</Button>
	</div>
{/snippet}
