<script>
	import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
	import FadeIn from './fade-in.svelte';
	import ScrollReveal from './scroll-reveal.svelte';

	const faqs = [
		{
			question: 'What makes this platform different from competitors?',
			answer:
				'Our platform combines cutting-edge technology with an intuitive user experience. We offer advanced features like real-time collaboration, AI-powered insights, and a fully customizable interface while maintaining fast performance and bank-level security.'
		},
		{
			question: 'How secure is the platform?',
			answer:
				'We implement enterprise-grade security measures including end-to-end encryption, SOC 2 compliance, regular security audits, and two-factor authentication. Your data is stored in ISO 27001 certified data centers with automated backups.'
		},
		{
			question: 'Can I integrate with my existing tools?',
			answer:
				'Absolutely! Our platform offers seamless integration with over 100+ popular tools and services through our API and native integrations. If you need a custom integration, our development team can help create a tailored solution.'
		},
		{
			question: 'What kind of support do you offer?',
			answer:
				'We provide 24/7 technical support through chat, email, and phone. Enterprise customers receive a dedicated account manager and priority support. Our extensive knowledge base and community forums are also available to all users.'
		},
		{
			question: 'Is there a free trial available?',
			answer:
				'Yes, we offer a 14-day free trial with access to all features. No credit card is required to start your trial. After your trial ends, you can choose the plan that best fits your needs or continue with our free tier with limited features.'
		},
		{
			question: 'How often do you release updates?',
			answer:
				'We have a continuous development cycle with minor updates released weekly and major feature updates quarterly. All updates are automatically applied with zero downtime, ensuring your workflow is never interrupted.'
		}
	];
</script>

<section id="faq" class="py-24">
	<div class="container mx-auto px-4 md:px-6">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
			<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
				Everything you need to know about our platform
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
	</div>
</section>
