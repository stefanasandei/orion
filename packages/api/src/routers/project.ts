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
    })
});
