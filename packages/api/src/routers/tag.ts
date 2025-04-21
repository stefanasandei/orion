import { db, tagTable, noteTagsTable, projectTagsTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const tagRouter = createRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .insert(tagTable)
        .values({
          name: input.name,
          userId: ctx.session.userId,
        })
        .returning();
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
        where: eq(tagTable.userId, ctx.session.userId),
        with: {
          notes: input.noteId ? {
            where: eq(noteTagsTable.noteId, input.noteId)
          } : undefined,
          projects: input.projectId ? {
            where: eq(projectTagsTable.projectId, input.projectId)
          } : undefined
        }
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

      // First verify the tag belongs to the user
      const tag = await db.query.tagTable.findFirst({
        where: and(
          eq(tagTable.id, input.tagId),
          eq(tagTable.userId, ctx.session.userId)
        )
      });

      if (!tag) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tag not found'
        });
      }

      if (input.noteId) {
        // Add connection to note
        return await db.insert(noteTagsTable)
          .values({
            noteId: input.noteId,
            tagId: input.tagId
          })
          .onConflictDoNothing()
          .returning();
      } else {
        // Add connection to project
        return await db.insert(projectTagsTable)
          .values({
            projectId: input.projectId!,
            tagId: input.tagId
          })
          .onConflictDoNothing()
          .returning();
      }
    }),

  removeFromEntity: protectedProcedure
    .input(z.object({ tagId: z.number(), projectId: z.number().optional(), noteId: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      if (input.noteId === undefined && input.projectId === undefined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either projectId or noteId must be provided'
        });
      }

      // First verify the tag belongs to the user
      const tag = await db.query.tagTable.findFirst({
        where: and(
          eq(tagTable.id, input.tagId),
          eq(tagTable.userId, ctx.session.userId)
        )
      });

      if (!tag) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tag not found'
        });
      }

      if (input.noteId) {
        // Remove connection from note
        return await db.delete(noteTagsTable)
          .where(and(
            eq(noteTagsTable.noteId, input.noteId),
            eq(noteTagsTable.tagId, input.tagId)
          ));
      } else {
        // Remove connection from project
        return await db.delete(projectTagsTable)
          .where(and(
            eq(projectTagsTable.projectId, input.projectId!),
            eq(projectTagsTable.tagId, input.tagId)
          ));
      }
    }),

  queryEntities: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      // First verify the tag belongs to the user
      const tag = await db.query.tagTable.findFirst({
        where: and(
          eq(tagTable.id, input.id),
          eq(tagTable.userId, ctx.session.userId)
        )
      });

      if (!tag) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tag not found'
        });
      }

      const includeTags = {
        with: {
          tags: {
            with: {
              tag: {
                columns: {
                  name: true
                }
              }
            }
          },
        }
      };

      // Get all projects and notes with this tag
      const [projects, notes] = await Promise.all([
        db.query.projectTagsTable.findMany({
          where: eq(projectTagsTable.tagId, input.id),
          with: {
            project: includeTags
          }
        }),
        db.query.noteTagsTable.findMany({
          where: eq(noteTagsTable.tagId, input.id),
          with: {
            note: includeTags
          }
        })
      ]);

      return {
        projects: projects.map(p => p.project),
        notes: notes.map(n => n.note),
        tag
      };
    })
});
