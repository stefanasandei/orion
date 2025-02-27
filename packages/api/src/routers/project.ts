import { db, noteTable, projectTable, userMetadataTable, projectPostTable, commentTable } from '@repo/db';
import { createRouter, protectedProcedure, publicProcedure } from '../context';
import { z } from 'zod';
import { and, eq, or } from 'drizzle-orm';
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
            notes: true,
            tags: true,
            user: {
              with: {
                metadata: {
                  columns: {
                    name: true
                  }
                }
              }
            },
            post: {
              with: {
                comments: true
              }
            }
          },
          where: and(eq(projectTable.id, input.id), or(
            eq(projectTable.userId, ctx.session.userId), eq(projectTable.isPublic, true)
          ))
        });

      if (!project) {
        return {
          project: undefined,
          noteTree: undefined
        }
      }

      const noteTree = NoteTreeService.buildTree(project.notes);

      return {
        project,
        noteTree: noteTree
      };
    }),

  getAllPublic: publicProcedure
    .query(async () => {
      // todo: this is a hacky solution, might want to look into stuff like elasticsearch
      // this returns ALL projects: to be used only for /browse (until a better solution)
      return await db.query.projectTable.findMany({
        where: eq(projectTable.isPublic, true),
        with: {
          user: {
            with: {
              metadata: {
                columns: {
                  name: true
                }
              }
            }
          }
        },
      });
    }),
  getAllPublicFromUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      // 1. find the user by the username
      const author = await db.query.userMetadataTable.findFirst({
        where: eq(userMetadataTable.name, input.name),
      });

      if (author == undefined) {
        return undefined;
      }

      // return his public projects and the username
      return await db.query.projectTable.findMany({
        where: and(eq(projectTable.isPublic, true), eq(projectTable.userId, author.userId)),
        with: {
          user: {
            with: {
              metadata: {
                columns: {
                  name: true
                }
              }
            }
          }
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable()
    }))
    .mutation(async ({ input, ctx }) => {
      const res = await db
        .update(projectTable)
        .set({
          name: input.name,
          description: input.description
        })
        .where(and(
          eq(projectTable.id, input.id),
          eq(projectTable.userId, ctx.session.userId)
        ))
        .returning();

      return res.length === 1;
    }),

  updatePublicity: protectedProcedure
    .input(z.object({
      id: z.number(),
      isPublic: z.boolean()
    }))
    .mutation(async ({ input, ctx }) => {
      // find the project first, need to know if it has a post
      const project = await db.query.projectTable.findFirst({
        where: and(
          eq(projectTable.id, input.id),
          eq(projectTable.userId, ctx.session.userId)
        ),
        with: {
          post: true
        }
      });

      if (!project) return false;

      // it's public but no post?
      if (input.isPublic && !project.post) {
        // Create new project post when making public
        const [post] = await db
          .insert(projectPostTable)
          .values({
            projectId: project.id,
          })
          .returning();

        if (!post) return false;
      } else if (!input.isPublic && project.post) {
        // Remove project post when making private
        await db
          .delete(projectPostTable)
          .where(eq(projectPostTable.projectId, project.id));
      }

      // Update project publicity
      const res = await db
        .update(projectTable)
        .set({ isPublic: input.isPublic })
        .where(eq(projectTable.id, input.id))
        .returning();

      return res.length === 1;
    }),
  addCommentToPublicPost: protectedProcedure
    .input(z.object({ content: z.string(), postId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await db
        .insert(commentTable)
        .values({
          postId: input.postId,
          userId: ctx.session.userId,
          content: input.content
        });
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
