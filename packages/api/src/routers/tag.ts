import { db, tagTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const tagRouter = createRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), projectId: z.number().optional(), noteId: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .insert(tagTable)
        .values({
          name: input.name,
          userId: ctx.session.userId,
          projectId: input.projectId,
          noteId: input.projectId
        })
    }),

  getFromUser: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.query.tagTable.findMany({
        where: eq(tagTable.userId, ctx.session.userId)
      });
    }),
  getFromEntity: protectedProcedure
    .input(z.object({ projectId: z.number().optional(), noteId: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      if (input.noteId === undefined && input.projectId === undefined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either projectId or noteId must be provided'
        });
      }

      return await db.query.tagTable.findMany({
        where: and(
          eq(tagTable.userId, ctx.session.userId),
          input.projectId ? eq(tagTable.projectId, input.projectId!) : eq(tagTable.noteId, input.noteId!)
        )
      });
    }),

  addToEntity: protectedProcedure
    .input(z.object({ tagId: z.number(), projectId: z.number().optional(), noteId: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (input.noteId === undefined && input.projectId === undefined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either projectId or noteId must be provided'
        });
      }

      return await db
        .update(tagTable)
        .set(input.noteId ? {
          noteId: input.noteId
        } : {
          projectId: input.projectId!
        })
        .where(and(
          eq(tagTable.id, input.tagId),
          eq(tagTable.userId, ctx.session.userId)
        )).returning()
    })
});
