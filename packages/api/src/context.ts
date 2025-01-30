import { CtxRequestEvent } from "@repo/core"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from 'superjson'
import { ZodError } from 'zod'

export const createTRPCContext = async (opts: { event: CtxRequestEvent }) => {
    return {
        ...opts,
    }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        }
    },
})

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const createCallerFactory = t.createCallerFactory

export const createRouter = t.router

const timingMiddleware = t.middleware(async ({ next, path }) => {
    const start = Date.now();

    // if (t._config.isDev) {
    //     // artificial delay in dev
    //     const waitMs = Math.floor(Math.random() * 400) + 100;
    //     await new Promise((resolve) => setTimeout(resolve, waitMs));
    // }

    const result = await next();

    const end = Date.now();
    console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

    return result;
});

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure
    .use(timingMiddleware)
    .use(({ ctx, next }) => {
        if (ctx.event.locals.session === null || ctx.event.locals.user === null) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next({
            ctx: {
                // infers the `session` as non-nullable
                session: { ...ctx.event.locals.session, user: ctx.event.locals.user },
            },
        });
    });
