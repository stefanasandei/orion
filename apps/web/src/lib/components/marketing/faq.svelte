<script>
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
	import FadeIn from './fade-in.svelte';
	import ScrollReveal from './scroll-reveal.svelte';

	const faqs = [
		{
			question: 'When will it be ready?',
			answer: "We're still cooking. Expect a launch in summer 2025."
		},
		{
			question: 'How will the pricing be?',
			answer:
				"Haven't decided yet. We are still in early development and we want to make sure we get it right."
		},
		{
			question: 'What are the main features?',
			answer:
				'You write your content the way you like it, without friction. Behind the curtain, everything is fed into your Agentic Knowledge System. Basically, you can chat with all your knowledge, query it instatly and get a helpful specialized assistant.'
		},
		{
			question: 'How is it different from the competition?',
			answer:
				'Convenience. Write your notes in a developer friendly way and then interact with it using powerful open tools. No lock down, open import/export, privacy. We are a team of passionate people, users of our own product, willing to improve it as much as possible.'
		}
	];
</script>

<section id="faq" class="py-24">
	<div class="container mx-auto px-4 md:px-6">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
			<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
				Everything you need to know about our platform.
			</p>
		</div>

		<div class="mx-auto max-w-3xl">
			<Accordion type="multiple" class="space-y-4">
				{#each faqs as faq, index}
					<AccordionItem
						value={`item-${index}`}
						class="rounded-lg border border-muted bg-card px-4"
					>
						<AccordionTrigger class="py-4 text-left font-medium">
							{faq.question}
						</AccordionTrigger>
						<AccordionContent class="pb-4 text-muted-foreground">
							{faq.answer}
						</AccordionContent>
					</AccordionItem>
				{/each}
			</Accordion>
		</div>

		<div class="mt-16 text-center">
			<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
				Expected public release date:
				<span class="font-bold">Summer 2025</span>. Contact by
				<a class="underline hover:cursor-pointer" href="mailto:asandei.stefanel@gmail.com">email</a>
				for more details.
			</p>
		</div>
	</div>
</section>
