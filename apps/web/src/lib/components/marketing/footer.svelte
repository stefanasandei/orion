<script lang="ts">
	import { Icons } from '../icons.svelte';
	import { t } from '@/utils/i18n/translations';
	import { Button } from '../ui/button';
	import { Mail, Send } from 'lucide-svelte';
	import { Input } from '../ui/input';
	import { toast } from 'svelte-sonner';

	let email = $state('');
	let subscribed = $state(false);

	const subscribeToNewsletter = (e: Event) => {
		e.preventDefault();

		// TODO: actual logic

		subscribed = false;
		email = '';

		toast.success('Subscribed to our newsletter! (TODO)');
	};
</script>

<footer class="border-border bg-background border-t pb-8 pt-16">
	<div class="container mx-auto px-4 md:px-6">
		<div class="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			<div>
				<div class="mb-4 flex items-center gap-2 text-xl font-semibold">
					<Icons.logo />
					<span>Orion</span>
				</div>
				<p class="text-muted-foreground mb-6">
					Making your workflow comfortable and productive through human-centered design.
				</p>
				<div class="flex gap-4">
					<a
						href={`https://github.com/stefanasandei/orion`}
						target="_blank"
						class="bg-muted/50 hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
					>
						<span class="sr-only">GitHub</span>
						<div class="size-6 rounded-full">
							<img alt="github logo" src="https://cdn.simpleicons.org/github/white" />
						</div>
					</a>
					<a
						href={`https://x.com/stefan_asandei`}
						target="_blank"
						class="bg-muted/50 hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
					>
						<span class="sr-only">Twitter</span>
						<div class="size-6 rounded-full">
							<img alt="github logo" src="https://cdn.simpleicons.org/x/white" />
						</div>
					</a>
				</div>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Product</h3>
				<ul class="space-y-3">
					<li>
						<a
							href="#features"
							class="text-muted-foreground hover:text-foreground transition-colors"
						>
							Features
						</a>
					</li>
					<li>
						<a
							href="#tech-stack"
							class="text-muted-foreground hover:text-foreground transition-colors"
						>
							Tech
						</a>
					</li>
					<li>
						<a href="#faq" class="text-muted-foreground hover:text-foreground transition-colors">
							Pricing (wip)
						</a>
					</li>
					<li>
						<a href="#faq" class="text-muted-foreground hover:text-foreground transition-colors">
							FAQ
						</a>
					</li>
					<li>
						<a href="#faq" class="text-muted-foreground hover:text-foreground transition-colors">
							Roadmap (wip)
						</a>
					</li>
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Company</h3>
				<ul class="space-y-3">
					{#each ['About Us', 'Careers', 'Blog', 'Legal', 'Contact'] as item}
						<li>
							<a href="#faq" class="text-muted-foreground hover:text-foreground transition-colors">
								{item} (wip)
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Subscribe to Our Newsletter</h3>
				<p class="text-muted-foreground mb-4">
					Get the latest updates and news delivered to your inbox
				</p>
				<form onsubmit={subscribeToNewsletter} class="space-y-2">
					<div class="flex gap-2">
						<div class="relative flex-1">
							<Mail
								class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform"
							/>
							<Input
								bind:value={email}
								type="email"
								placeholder="Your email address"
								class="pl-10"
								required
							/>
						</div>
						<Button aria-label="send" type="submit" size="icon">
							<Send class="h-4 w-4" />
						</Button>
					</div>
					<!-- {subscribed && (
                <p class="text-xs text-green-600">Thanks for subscribing!</p>
              )} -->
				</form>
			</div>
		</div>

		<div class="border-border text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
			<p>
				© {new Date().getFullYear()}
				{' '}
				<a
					href={'https://asandei.com'}
					target="_blank"
					rel="noreferrer"
					class="font-medium underline underline-offset-4"
				>
					Stefan Asandei
				</a>. All rights reserved.
			</p>
		</div>
	</div>
</footer>
