<script lang="ts">
	import { type Editor } from '@tiptap/core';
	import Undo from './icons/undo.svelte';
	import Redo from './icons/redo.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import Bold from './icons/bold.svelte';
	import Italic from './icons/italic.svelte';
	import Underline from './icons/underline.svelte';
	import Strikethrough from './icons/strikethrough.svelte';
	import Link from './icons/link.svelte';
	import Code from './icons/code.svelte';
	import BlockQuote from './icons/block-quote.svelte';
	import Subscript from './icons/subscript.svelte';
	import ButtleList from './icons/buttle-list.svelte';
	import OrderedList from './icons/ordered-list.svelte';
	import TaskList from './icons/task-list.svelte';
	import Highlighter from './icons/highlighter.svelte';
	// import Superscript from './icons/superscript.svelte';
	import Textcolor from './icons/textcolor.svelte';
	import Align from './icons/textalign.svelte';
	import Quickcolor from './icons/quickcolor.svelte';
	import Table from './icons/table.svelte';
	import Image from './icons/image.svelte';
	import Text from './icons/text.svelte';
	import SearchReplace from './icons/search-replace.svelte';
	import Export from './icons/export.svelte';
	import Video from './icons/video.svelte';
	import FontSize from './icons/font-size.svelte';
	import Audio from './icons/audio.svelte';
	import Button from '../ui/button/button.svelte';
	import SaveNote from '../project/save-note.svelte';
	interface Props {
		editor: Editor;
	}

	let { editor }: Props = $props();
</script>

<div class="flex w-full flex-row items-center justify-between gap-2">
	<div class="flex h-full w-full items-center overflow-auto border-b p-1 *:mx-1">
		<Undo {editor} />
		<Redo {editor} />
		<Separator orientation="vertical" class="h-fit" />
		<div class="hidden sm:flex">
			<FontSize {editor} />
		</div>
		<div class="hidden xl:flex">
			<Text {editor} />
		</div>
		<Bold {editor} />
		<Italic {editor} />
		<Underline {editor} />
		<Strikethrough {editor} />
		<div class="hidden xl:flex">
			<Align {editor} />
			<Link {editor} />
			<!-- <Subscript {editor} /> -->
			<!-- <Superscript {editor} /> -->
			<div class="hidden 2xl:flex">
				<Code {editor} />
				<BlockQuote {editor} />
				<ButtleList {editor} />
				<OrderedList {editor} />
				<TaskList {editor} />
				<Image {editor} />
				<!-- <Video {editor} /> -->
				<!-- <Audio {editor} /> -->
				<Table {editor} />
			</div>
			<!-- <Textcolor {editor} /> -->
			<Highlighter {editor} />
			<!-- <Quickcolor {editor} /> -->
		</div>
		<Separator orientation="vertical" class="h-fit" />
	</div>

	<div class="flex w-fit items-center border-b p-1 *:mx-1">
		<SaveNote
			jsonContent={editor.getJSON()}
			htmlContent={editor.getHTML()}
			textContent={editor.getText()}
		/>
		<div class="hidden xl:flex">
			<SearchReplace {editor} />
			<Export {editor} />
		</div>
	</div>
</div>
