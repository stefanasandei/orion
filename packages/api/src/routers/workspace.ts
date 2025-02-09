import { db, workspaceTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context'
import { z } from "zod";

export const workspaceRouter = createRouter({
    create: protectedProcedure.input(z.object({ name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return await db.insert(workspaceTable)
                .values({
                    userId: ctx.session.userId,
                    name: input.name
                }).returning();
        })
})
