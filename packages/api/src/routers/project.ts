import { db, noteTable, projectTable, userMetadataTable, projectPostTable, commentTable, noteTagsTable, projectTagsTable } from '@repo/db';
import { createRouter, protectedProcedure, publicProcedure } from '../context';
import { z } from 'zod';
import { and, eq, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { NoteTreeService } from '../services/note-tree';
import { embeddingsManager, generatePdfMetadata } from '@repo/agent';
import { hasAIEnabled } from "../enabled-ai"
import { cacheService } from '../services/cache';

export const projectRouter = createRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const cacheKey = `project:${input.id}`;
      await cacheService.invalidateItem(cacheKey);

      return await db
        .delete(projectTable)
        .where(and(eq(projectTable.id, input.id), eq(projectTable.userId, ctx.session.userId)));
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const cacheKey = `project:${input.id}`;
      const cached = await cacheService.getItem(cacheKey);

      if (cached !== null) {
        return cached as typeof result;
      }

      // return the requested project's metadata, if it is owned by the current user
      const project = await db.query.projectTable
        .findFirst({
          with: {
            notes: true,
            tags: {
              with: {
                tag: {
                  columns: {
                    name: true
                  }
                }
              }
            },
            user: {
              with: {
                metadata: {
                  columns: {
                    name: true
                  }
                }
              }
            },

            // meaning: also returns its public metadata (post), along with its comments
            // return the name of each user who wrote a comment
            post: {
              with: {
                comments: {
                  with: {
                    user: {
                      columns: {},
                      with: {
                        metadata: {
                          columns: {
                            name: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
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

      const result = {
        project,
        noteTree: noteTree
      };

      // cache the result
      await cacheService.insertItem(cacheKey, result, true);

      return result;
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
      description: z.string().nullable(),
      tags: z.array(z.object({ id: z.number() }))
    }))
    .mutation(async ({ input, ctx }) => {
      const cacheKey = `project:${input.id}`;
      await cacheService.invalidateItem(cacheKey);

      return await db.transaction(async (tx) => {
        // First update the project metadata
        const res = await tx
          .update(projectTable)
          .set({
            name: input.name,
            description: input.description,
          })
          .where(and(
            eq(projectTable.id, input.id),
            eq(projectTable.userId, ctx.session.userId)
          ))
          .returning();

        if (res.length !== 1) return false;

        // Remove all existing tag connections for this project
        await tx
          .delete(projectTagsTable)
          .where(eq(projectTagsTable.projectId, input.id));

        // Add new tag connections if any tags were selected
        if (input.tags.length > 0) {
          await tx
            .insert(projectTagsTable)
            .values(
              input.tags.map(tag => ({
                projectId: input.id,
                tagId: tag.id
              }))
            )
            .onConflictDoNothing();
        }

        return true;
      });
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
      const cacheKey = `project:${input.projectId}`;
      await cacheService.invalidateItem(cacheKey);

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
  createQuickNote: protectedProcedure
    .input(z.object({ content: z.string(), type: z.enum(["thought", "task", "newsfeed"]) }))
    .mutation(async ({ input, ctx }) => {
      await cacheService.invalidateItem(`quick_notes:${ctx.session.userId}`);

      // used to create a note, which is not accessible in the editor
      // aka a quick-thought, a todo task, or an item on the news feed
      const result = await db
        .insert(noteTable)
        .values({
          name: input.content,
          type: input.type,
          userId: ctx.session.userId,

          textContent: "",
          jsonContent: "",
          htmlContent: "",
        })
        .returning({ id: noteTable.id });

      // generate embeddings and add them to the db
      await embeddingsManager.upsert(input.content, result[0]!.id);

      return result;
    }),
  createFileNote: publicProcedure
    .input(z.object({ fileUrl: z.string(), filename: z.string(), projectId: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      // 1. insert (filename, file url) into the note table
      const result = await db
        .insert(noteTable)
        .values({
          name: input.filename,
          projectId: (input.projectId == 0 ? null : input.projectId),
          type: "file",
          userId: input.userId,

          textContent: input.fileUrl,
          jsonContent: "",
          htmlContent: "",
        })
        .returning({ id: noteTable.id });

      if (input.projectId != 0) {
        const cacheKey = `project:${input.projectId}`;
        await cacheService.invalidateItem(cacheKey);
      }

      // 2. create embeddings for image/pdf
      if (!hasAIEnabled(input.userId)) {
        return result;
      }

      if (input.filename.endsWith(".pdf")) {
        await Promise.all([
          embeddingsManager.insertPDF(input.fileUrl, result[0]!.id),

          // 3. for PDFs, we also want to generate summary + suggested questions
          generatePdfMetadata(input.fileUrl, result[0]!.id)
        ]);
      } else {
        await embeddingsManager.insertImage(input.fileUrl, result[0]!.id);
      }

      return result;
    }),

  deleteNote: protectedProcedure
    .input(z.object({ noteId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await cacheService.invalidateItem(`quick_notes:${ctx.session.userId}`);

      // delete the embeddings from the database
      await embeddingsManager.delete(input.noteId);

      const deletedNote = await db
        .delete(noteTable)
        .where(and(eq(noteTable.id, input.noteId), eq(noteTable.userId, ctx.session.userId)))
        .returning({ projectId: noteTable.projectId });

      if (deletedNote[0]!.projectId !== undefined) {
        const cacheKey = `project:${deletedNote[0]!.projectId}`;
        await cacheService.invalidateItem(cacheKey);
      }
    }),
  getNeighborNotes: protectedProcedure
    .input(z.object({ noteId: z.number() }))
    .query(async ({ input, ctx }) => {
      // given a single note id, we want to find all of the other notes from its project

      // 1. find the project
      const cacheKey = `note_project:${input.noteId}`;
      let projectId: number | null;

      const cachedProjectId = await cacheService.getItem(cacheKey);
      if (cachedProjectId !== null) {
        // get the cached id
        projectId = (cachedProjectId as number);
      } else {
        // call the database for the id
        const { projectId: fetchedProjectId } = (await db.query.noteTable.findFirst({
          where: and(
            eq(noteTable.id, input.noteId), eq(noteTable.userId, ctx.session.userId)
          ),
          columns: {
            projectId: true
          }
        }))!;

        projectId = fetchedProjectId;

        // cache it
        await cacheService.insertItem(cacheKey, projectId, true);
      }


      if (projectId == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found'
        });
      }

      // 2. query the notes
      return await db
        .select({ id: noteTable.id, name: noteTable.name }).from(noteTable)
        .where(and(
          eq(noteTable.projectId, projectId),
          eq(noteTable.userId, ctx.session.userId)
        ));
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
      const data = await db.query.noteTable.findFirst({
        where: and(
          eq(noteTable.id, input.noteId)
        ),
        with: {
          tags: {
            with: {
              tag: {
                columns: {
                  id: true,
                  name: true
                }
              }
            }
          },
          project: {
            columns: {
              isPublic: true
            }
          }
        }
      });

      if (!data) return undefined;

      if (data.userId != ctx.session.userId && !data.project?.isPublic)
        return undefined;

      // Transform the data to match the expected format
      return {
        ...data,
        tags: data.tags.map(t => t.tag)
      };
    }),
  saveNote: protectedProcedure
    .input(z.object({ noteId: z.number(), textContent: z.string(), jsonContent: z.string(), htmlContent: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // update embeddings for documents
      await embeddingsManager.upsert(input.textContent, input.noteId);

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
  updateQuickNote: protectedProcedure
    .input(z.object({ noteId: z.number(), content: z.string(), tags: z.array(z.object({ id: z.number() })) }))
    .mutation(async ({ input, ctx }) => {
      //  update embeddings for notes
      await embeddingsManager.upsert(input.content, input.noteId);

      await db.transaction(async (tx) => {
        // 1. update note contents
        await tx
          .update(noteTable)
          .set({
            name: input.content
          })
          .where(and(
            eq(noteTable.id, input.noteId),
            eq(noteTable.userId, ctx.session.userId)
          ));

        // 2. Remove existing tag connections for this note
        await tx
          .delete(noteTagsTable)
          .where(eq(noteTagsTable.noteId, input.noteId));

        // 3. Add new tag connections
        if (input.tags.length > 0) {
          await tx
            .insert(noteTagsTable)
            .values(
              input.tags.map(tag => ({
                noteId: input.noteId,
                tagId: tag.id
              }))
            )
            .onConflictDoNothing();
        }
      });
    }),
});
