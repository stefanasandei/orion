import { CtxRequestEvent } from "@repo/core"
import { initTRPC } from "@trpc/server"
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

export const publicProcedure = t.procedure
