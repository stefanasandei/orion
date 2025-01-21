<script lang="ts">
	import '../app.css';
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
	import { preferences } from '@/utils/stores';
	import { onMount } from 'svelte';

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

<QueryClientProvider client={queryClient}>
	<main class="bg-background text-foreground flex min-h-screen flex-col">
		<slot />
	</main>
</QueryClientProvider>
