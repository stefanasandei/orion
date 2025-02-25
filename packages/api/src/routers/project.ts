import { db, noteTable, projectTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { NoteTreeService } from '../services/note-tree';

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

      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found'
        });
      }

      const noteTree = NoteTreeService.buildTree(project.notes);

      return {
        project,
        noteTree: noteTree
      };
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string(), description: z.string().nullable(), isPublic: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const res = await db
        .update(projectTable)
        .set({ name: input.name, description: input.description, isPublic: input.isPublic })
        .where(and(eq(projectTable.id, input.id), eq(projectTable.userId, ctx.session.userId)));

      return res.rowCount == 1;
    }),

  createNoteDocument: protectedProcedure
    .input(z.object({ projectId: z.number(), noteName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .insert(noteTable)
        .values({
          name: input.noteName,
          projectId: input.projectId,
          type: "document",
          textContent: "",
          jsonContent: "",
          htmlContent: "",
          userId: ctx.session.userId,
        });
    }),
  deleteNote: protectedProcedure
    .input(z.object({ noteId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .delete(noteTable)
        .where(and(eq(noteTable.id, input.noteId), eq(noteTable.userId, ctx.session.userId)));
    }),
  getNeighborNotes: protectedProcedure
    .input(z.object({ noteId: z.number() }))
    .query(async ({ input, ctx }) => {
      // given a single note id, we want to find all of the other notes from its project

      // 1. find the project
      const { projectId } = (await db.query.noteTable.findFirst({
        where: and(
          eq(noteTable.id, input.noteId), eq(noteTable.userId, ctx.session.userId)
        ),
        columns: {
          projectId: true
        }
      }))!;

      if (projectId == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found'
        });
      }

      // 2. query the notes
      return await db.select({ id: noteTable.id, name: noteTable.name }).from(noteTable)
        .where(and(eq(noteTable.projectId, projectId), eq(noteTable.userId, ctx.session.userId)));
    }),
  makeNoteParentTo: protectedProcedure
    .input(z.object({ parentNoteId: z.number().nullable(), childNoteId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .update(noteTable)
        .set({ parentNote: input.parentNoteId })
        .where(and(eq(noteTable.id, input.childNoteId), eq(noteTable.userId, ctx.session.userId)));
    }),

  getNote: protectedProcedure
    .input(z.object({ noteId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await db.query.noteTable.findFirst(({
        where: and(
          eq(noteTable.id, input.noteId), eq(noteTable.userId, ctx.session.userId)
        ),
      }));
    }),
  saveNote: protectedProcedure
    .input(z.object({ noteId: z.number(), textContent: z.string(), jsonContent: z.string(), htmlContent: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .update(noteTable)
        .set({
          textContent: input.textContent,
          jsonContent: input.jsonContent,
          htmlContent: input.htmlContent
        })
        .where(and(
          eq(noteTable.id, input.noteId), eq(noteTable.userId, ctx.session.userId)
        ));
    }),
});
