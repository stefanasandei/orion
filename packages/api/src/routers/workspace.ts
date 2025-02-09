import { db, workspaceTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context'
import { z } from "zod";
import { and, eq } from 'drizzle-orm';

export const workspaceRouter = createRouter({
    create: protectedProcedure.input(z.object({ name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return await db.insert(workspaceTable)
                .values({
                    userId: ctx.session.userId,
                    name: input.name
                }).returning();
        }),
    delete: protectedProcedure.input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
            return await db.delete(workspaceTable)
                .where(and(eq(workspaceTable.id, input.id), eq(workspaceTable.userId, ctx.session.userId)));
        })
})
