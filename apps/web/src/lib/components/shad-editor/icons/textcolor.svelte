<script lang="ts">
	import { Baseline } from 'lucide-svelte';
	import { X } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { type Editor } from '@tiptap/core';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '@/utils/cn';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { mode } from 'mode-watcher';
	import ColorPicker from 'svelte-awesome-color-picker';

	interface Props {
		editor: Editor;
		color?: string;
	}

	let { editor, color = $bindable('') }: Props = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Popover.Root>
				<Popover.Trigger>
					<Button
						variant="ghost"
						size="sm"
						class={cn('h-8 gap-1 p-1', editor.isActive('textStyle') && 'bg-muted')}
						onclick={() => editor.chain().focus()}
					>
						<Baseline />
						<ChevronDown class="text-muted-foreground !size-2" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="bg-popover shadow-lg *:my-2">
					<div class="flex items-center justify-between">
						<h1 class="text-[1.2rem] font-bold">Pick a text color</h1>
						<Popover.Close>
							<X class="text-muted-foreground size-4" />
						</Popover.Close>
					</div>
					<div class:dark={$mode === 'dark'}>
						<ColorPicker
							bind:hex={color}
							sliderDirection="vertical"
							isTextInput={false}
							isAlpha
							on:input={(event) => {
								if (event.detail.hex === undefined) return;
								color = event.detail.hex;
								editor.chain().focus().setColor(color).run();
							}}
							isDialog={false}
							--picker-indicator-size="1rem"
							--input-size="1rem"
						/>
					</div>
					<div class="flex items-center justify-end gap-2">
						<Button
							variant="outline"
							size="sm"
							class="border-destructive text-destructive hover:bg-destructive hover:text-foreground"
							onclick={() => editor.chain().focus().unsetColor().run()}
							>Remove Color
						</Button>
					</div>
				</Popover.Content>
			</Popover.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Text Color</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
