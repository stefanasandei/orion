<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { Editor } from '@tiptap/core';
	import { ChevronDown } from 'lucide-svelte';
	import { t } from '@/utils/i18n/translations';

	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();

	const FONT_SIZE = [
		{ label: $t('editor.font_size.smaller'), value: '12px' },
		{ label: $t('editor.font_size.small'), value: '14px' },
		{ label: $t('editor.font_size.medium'), value: '' },
		{ label: $t('editor.font_size.large'), value: '18px' },
		{ label: $t('editor.font_size.extra_large'), value: '24px' }
	];

	let currentSize = $derived.by(() => editor.getAttributes('textStyle').fontSize || '');

	const currentLabel = $derived.by(() => {
		const l = FONT_SIZE.find((f) => f.value === currentSize);
		if (l) return l.label;
		return $t('editor.font_size.medium');
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Tooltip.Provider delayDuration={100}>
			<Tooltip.Root>
				<Tooltip.Trigger class={buttonVariants({ variant: 'ghost', class: 'h-8 w-fit gap-1 p-1' })}>
					<span>{currentLabel}</span>
					<ChevronDown class="text-muted-foreground !size-2" />
				</Tooltip.Trigger>
				<Tooltip.Content
					avoidCollisions
					class="bg-background text-foreground border p-2 font-medium"
				>
					<p>{$t('editor.font_size.title')}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="h-fit w-fit" portalProps={{ disabled: true, to: undefined }}>
		{#each FONT_SIZE as fontSize}
			<DropdownMenu.Item
				onclick={() => {
					editor.chain().focus().setFontSize(fontSize.value).run();
				}}
				style={`font-size: ${fontSize.value}`}>{fontSize.label}</DropdownMenu.Item
			>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
