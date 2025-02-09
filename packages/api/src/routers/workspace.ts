import { db, workspaceTable, projectTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';

export const workspaceRouter = createRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .insert(workspaceTable)
        .values({
          userId: ctx.session.userId,
          name: input.name
        })
        .returning();
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .delete(workspaceTable)
        .where(and(eq(workspaceTable.id, input.id), eq(workspaceTable.userId, ctx.session.userId)));
    }),
  createProject: protectedProcedure
    .input(z.object({ workspaceId: z.number(), name: z.string(), description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .insert(projectTable)
        .values({
          userId: ctx.session.userId,
          workspaceId: input.workspaceId,
          name: input.name,
          description: input.description
        })
        .returning();
    })
});
