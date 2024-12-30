<script lang="ts">
	import '../app.css';
	import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
	const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
	<main class="">
		<div class="bg-background text-foreground h-screen">
			<slot />
		</div>
	</main>
</QueryClientProvider>
