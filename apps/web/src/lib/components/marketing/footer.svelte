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

<footer class="border-t border-border bg-background pb-8 pt-16">
	<div class="container mx-auto px-4 md:px-6">
		<div class="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			<div>
				<div class="mb-4 flex items-center gap-2 text-xl font-semibold">
					<Icons.logo />
					<span>Orion</span>
				</div>
				<p class="mb-6 text-muted-foreground">
					Making your workflow comfortable and productive through human-centered design.
				</p>
				<div class="flex gap-4">
					<a
						href={`https://github.com/stefanasandei/orion`}
						target="_blank"
						class="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 transition-colors hover:bg-primary/10"
					>
						<span class="sr-only">GitHub</span>
						<div class="size-6 rounded-full">
							<img alt="github logo" src="https://cdn.simpleicons.org/github/white" />
						</div>
					</a>
					<a
						href={`https://x.com/stefan_asandei`}
						target="_blank"
						class="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 transition-colors hover:bg-primary/10"
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
					{#each ['Features', 'Integrations', 'Pricing', 'FAQ', 'Roadmap'] as item}
						<li>
							<a href="#" class="text-muted-foreground transition-colors hover:text-foreground">
								{item}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Company</h3>
				<ul class="space-y-3">
					{#each ['About Us', 'Careers', 'Blog', 'Legal', 'Contact'] as item}
						<li>
							<a href="#" class="text-muted-foreground transition-colors hover:text-foreground">
								{item}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h3 class="mb-4 font-semibold">Subscribe to Our Newsletter</h3>
				<p class="mb-4 text-muted-foreground">
					Get the latest updates and news delivered to your inbox
				</p>
				<form onsubmit={subscribeToNewsletter} class="space-y-2">
					<div class="flex gap-2">
						<div class="relative flex-1">
							<Mail
								class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground"
							/>
							<Input
								bind:value={email}
								type="email"
								placeholder="Your email address"
								class="pl-10"
								required
							/>
						</div>
						<Button type="submit" size="icon">
							<Send class="h-4 w-4" />
						</Button>
					</div>
					<!-- {subscribed && (
                <p class="text-xs text-green-600">Thanks for subscribing!</p>
              )} -->
				</form>
			</div>
		</div>

		<div class="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
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
