<script lang="ts">
	import { ChevronDown, Code, DiamondMinus, Download, FileJson, FileText } from 'lucide-svelte';
	import { type Editor } from '@tiptap/core';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { downloadFile } from '../custom/utils.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { t } from '$base/src/lib/utils/i18n/translations.js';

	let { editor }: { editor: Editor } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="ghost" size="sm" class="h-8">
						<Download />
						<ChevronDown class="text-muted-foreground size-3" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>{$t('editor.export_data')}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-48 p-2">
		<DropdownMenu.Item onclick={() => downloadFile(editor.getHTML(), 'data.html')}>
			<Code />
			<span>{$t('editor.export.as_html')}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => downloadFile(editor.storage.markdown.getMarkdown(), 'data.md')}
		>
			<DiamondMinus />
			<span>{$t('editor.export.as_markdown')}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => downloadFile(editor.getText(), 'data.txt')}>
			<FileText />
			<span>{$t('editor.export.as_text')}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => downloadFile(JSON.stringify(editor.getJSON()), 'data.json')}>
			<FileJson />
			<span>{$t('editor.export.as_json')}</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
