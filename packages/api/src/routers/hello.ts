import { createRouter, publicProcedure } from '../context'
import { z } from "zod";

export const helloRouter = createRouter({
    msg: publicProcedure.query(({ }) => {
        return {
            message: `Hello, world from tRPC!`,
        }
    }),
    processName: publicProcedure.input(z.object({ name: z.string() })).mutation(({ input }) => {
        return { message: `Hello, ${input.name} from tRPC!` };
    })
})