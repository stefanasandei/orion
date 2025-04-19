<script lang="ts">
	import { untrack } from 'svelte';
	import katex from 'katex';
	import 'katex/dist/katex.min.css';
	import Prism from 'prismjs';
	import sanitizeHtml from 'sanitize-html';

	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-typescript';
	import 'prismjs/components/prism-python';
	import 'prismjs/components/prism-java';
	import 'prismjs/components/prism-c';
	import 'prismjs/components/prism-cpp';

	import 'prism-themes/themes/prism-atom-dark.min.css';
	// import 'prism-themes/themes/prism-material-oceanic.min.css';
	// import 'prism-themes/themes/prism-nord.min.css';
	import { cn } from '../utils/cn';

	interface Props {
		className?: string;
		htmlContent: string;
	}

	const { htmlContent, className }: Props = $props();

	let container = $state<HTMLDivElement>();

	function renderMath(content: string): string {
		// this regex matches both inline ($...$) and display ($$...$$) math.
		// tt replaces each match with the corresponding KaTeX-rendered string.
		return content.replace(/(\${1,2})([^\$]+?)\1/g, (match, delimiter, math) => {
			try {
				// use display mode for $$...$$, inline mode for $...$
				const displayMode = delimiter.length === 2;
				return katex.renderToString(math, { displayMode, throwOnError: false });
			} catch (err) {
				console.error('KaTeX render error:', err);
				return match;
			}
		});
	}

	function highlightCode(container: HTMLElement) {
		const codeBlocks = container.querySelectorAll('pre code');
		try {
			codeBlocks.forEach((block) => {
				Prism.highlightElement(block);
			});
		} catch {}
	}

	// update the container's inner HTML whenever htmlContent changes.
	$effect(() => {
		const _container = untrack(() => container);
		if (_container) {
			const html = sanitizeHtml(htmlContent, {
				// allowedTags: false,
				allowedAttributes: false
			});
			_container.innerHTML = renderMath(html);

			highlightCode(_container);
		}
	});
</script>

<div
	bind:this={container}
	class={cn(
		'prose dark:prose-invert text-primary-foreground min-w-full text-justify',
		className ?? ''
	)}
></div>
