<script lang="ts">
	import '../app.css';
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<main class="bg-background text-foreground flex min-h-screen flex-col">
		<slot />
	</main>
</QueryClientProvider>
