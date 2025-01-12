import type { AppRouter } from "@repo/api";
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';
import superjson from 'superjson';

const client = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: "/api/trpc",
        }),
    ],
    transformer: superjson
});

export const trpc = () => svelteQueryWrapper<AppRouter>({ client });
