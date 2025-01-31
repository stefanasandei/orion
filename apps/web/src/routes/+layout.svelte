<script lang="ts">
	import '../app.css';
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
	import { preferences } from '@/utils/stores';
	import { onMount } from 'svelte';
	import { Toaster } from '@/components/ui/sonner/index.js';

	const queryClient = new QueryClient();

	// subscribe to theme changes
	onMount(() => {
		const unsubscribe = preferences.subscribe(({ theme }) => {
			if (theme === 'dark') {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		});

		return () => unsubscribe();
	});
</script>

<svelte:head>
	{@html `
		<script>
			let theme = localStorage.getItem('preferences');
			theme = theme ? JSON.parse(theme).theme : 'light';
			document.documentElement.classList.toggle('dark', theme === 'dark');
		</script>
	`}
</svelte:head>

<Toaster position="bottom-center" richColors />

<QueryClientProvider client={queryClient}>
	<main class="bg-muted text-foreground flex min-h-screen flex-col overflow-hidden">
		<slot />
	</main>
</QueryClientProvider>
