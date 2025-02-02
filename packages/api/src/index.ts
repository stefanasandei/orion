import { helloRouter } from './routers/hello'
import { createCallerFactory, createRouter } from './context'
import { userRouter } from './routers/user'

export const appRouter = createRouter({
    hello: helloRouter,
    user: userRouter
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)

export { createTRPCContext } from './context'
export type { Context } from './context'

export { TimeBasedTwoFactorAuth } from "./services/2fa";
export { mockTotpService } from "./services/mocks/2fa";
