import { helloRouter } from './routers/hello'
import { createCallerFactory, createRouter } from './context'

export const appRouter = createRouter({
    hello: helloRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)

export { createTRPCContext } from './context'
export type { Context } from './context'
