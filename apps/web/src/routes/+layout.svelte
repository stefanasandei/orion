<script lang="ts">
	import '../app.css';
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<main class="flex min-h-screen flex-col bg-background text-foreground">
		<slot />
	</main>
</QueryClientProvider>
