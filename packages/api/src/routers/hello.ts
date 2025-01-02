import { createRouter, publicProcedure } from '../context'

export const helloRouter = createRouter({
    msg: publicProcedure.query(({ }) => {
        return {
            message: `Hello, world from tRPC!`,
        }
    }),
})
