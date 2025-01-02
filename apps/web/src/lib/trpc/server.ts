import { createTRPCSvelteServer } from "trpc-svelte-query/server";
import { appRouter, createTRPCContext } from "@repo/api";
import type { Context } from "@repo/api";
import type { RequestEvent } from "@sveltejs/kit";
import type { CtxRequestEvent } from "@repo/core";

export const trpcServer = createTRPCSvelteServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: function (event: RequestEvent): Context | Promise<Context> {
        return createTRPCContext({ event: event as CtxRequestEvent })
    }
});
