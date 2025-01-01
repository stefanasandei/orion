import { db, userTable } from '@repo/db';
import { createRouter, publicProcedure } from '../context'
import { z } from "zod";

export const helloRouter = createRouter({
    msg: publicProcedure.query(({ }) => {
        return {
            message: `Hello, world from tRPC!`,
        }
    }),
    processName: publicProcedure.input(z.object({ name: z.string() })).mutation(async ({ input: _input }) => {
        // return { message: `Hello, ${_input.name} from tRPC!` };
        const res = await db.select().from(userTable);
        return res;
    })
})
