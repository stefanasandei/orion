import { db, projectTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';

export const projectRouter = createRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .delete(projectTable)
        .where(and(eq(projectTable.id, input.id), eq(projectTable.userId, ctx.session.userId)));
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      // return the requested project's metadata, if it is owned by the current user
      const project = await db.query.projectTable
        .findFirst({
          with: {
            notes: true
          },
          where: and(eq(projectTable.id, input.id), eq(projectTable.userId, ctx.session.userId))
        });

      return project;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string(), description: z.string().nullable() }))
    .mutation(async ({ input, ctx }) => {
      const res = await db
        .update(projectTable)
        .set({ name: input.name, description: input.description })
        .where(and(eq(projectTable.id, input.id), eq(projectTable.userId, ctx.session.userId)));

      return res.rowCount == 1;
    })
});
