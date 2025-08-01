import { registerUser, loginUser, logoutUser, AuthFailReason, validateSessionToken } from '@repo/auth';
import { createRouter, protectedProcedure, publicProcedure } from '../context'
import { z } from "zod";
import { ratelimit } from '../services/ratelimit';
import { db, sessionTable, userMetadataTable, noteTable, tagTable, projectTable, workspaceTable, userTable, usageTable, conversationTable } from '@repo/db';
import { eq, and, sql, or, desc } from 'drizzle-orm';
import process from "process";
import jwt from "jsonwebtoken";
import { resendService } from '../services/email';
import { totpService } from '../services/2fa';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { cacheService } from '../services/cache';

export const userRouter = createRouter({
    register: publicProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // creates the user & user metadata
            const authResponse = await registerUser(input, ctx.event);

            if (authResponse.success) {
                // TODO: poor man's analytics
                await resendService.send(["asandei.stefanel@gmail.com"], "Orion: new user", `
                <h1>New user!</h1>
                <pre>Email: ${input.email}</pre><br/>
                <pre>Name: ${input.name}</pre>`);
            }

            return authResponse;
        }),
    login: publicProcedure
        .input(z.object({ email: z.string(), password: z.string(), rememberMe: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            const result = await loginUser(input, ctx.event);
            if (result.success) {
                return result;
            }

            const reachedLimit = await ratelimit.recordAuthAttempt(ctx.event.getClientAddress());
            if (!reachedLimit) {
                return result;
            }

            result.reason = AuthFailReason.RateLimited;

            return result;
        }),
    logout: protectedProcedure
        .mutation(async ({ ctx }) => {
            return logoutUser(ctx.event);
        }),

    sendConfirmationEmail: protectedProcedure
        .mutation(async ({ ctx }) => {
            // 1. generate jwt token 
            const EMAIL_SECRET = process.env["EMAIL_SECRET"]!;
            const WEBSITE_URL = process.env["PUBLIC_WEBSITE_URL"]!;

            const token = jwt.sign({ userId: ctx.session.userId }, EMAIL_SECRET, {
                expiresIn: '12h'
            });

            const url = `${WEBSITE_URL}/confirmation/${token}`;
            console.log(token);

            // 2. send email
            const userEmail = ctx.event.locals.user!.metadata.email;
            const htmlContent = `Please click this email to confirm your email: <a href="${url}">${url}</a>`;

            const success = await resendService.send([userEmail], "Confirm your email", htmlContent);

            // 3. return response
            return success;
        }),
    confirmEmail: protectedProcedure
        .input(z.object({ token: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const EMAIL_SECRET = process.env["EMAIL_SECRET"]!;
            const decoded = jwt.verify(input.token, EMAIL_SECRET) as { userId: string };

            if (parseInt(decoded.userId) !== ctx.session.userId) {
                return false;
            }

            return await db.update(userMetadataTable)
                .set({ emailVerified: true })
                .where(eq(userMetadataTable.userId, ctx.session.userId));
        }),
    checkPassword: protectedProcedure
        .input(z.object({ password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const hashedPassword = encodeHexLowerCase(sha256(new TextEncoder().encode(input.password)));

            const response = await db.select({ userId: userMetadataTable.userId })
                .from(userMetadataTable)
                .where(and(
                    eq(userMetadataTable.userId, ctx.session.userId),
                    eq(userMetadataTable.passwordHash, hashedPassword))
                );

            return response.length > 0;
        }),

    get2FASetupQRCode: protectedProcedure
        .query(async ({ ctx }) => {
            // generate user secret + qr code
            const userSecret = await totpService.generateSecret();
            const email = ctx.session.user.metadata.email;

            const uri = totpService.createKeyURI(email, userSecret);

            return {
                secret: userSecret,
                qrcode: uri.qr_svg
            }
        }),
    setup2FA: protectedProcedure
        .input(z.object({ secret: z.string() }))
        .mutation(async ({ input, ctx }) => {
            // called after the user scanned the qr code and it was verified
            // save the secret in the db

            await db.update(userMetadataTable)
                .set({
                    twoFactorEnabled: true,
                    totpKey: input.secret
                }).where(eq(userMetadataTable.userId, ctx.session.userId));
        }),
    disable2FA: protectedProcedure
        .mutation(async ({ ctx }) => {
            await db.update(userMetadataTable)
                .set({ twoFactorEnabled: false, totpKey: null })
                .where(eq(userMetadataTable.userId, ctx.session.userId));
        }),
    verifyTOTPCode: protectedProcedure
        .input(z.object({ code: z.string(), secret: z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
            // check if the code == totp(user secret)

            // 1. get user's totp secret
            let secret = input.secret;
            if (secret === undefined) {
                const userSecret = await db.select({ totpKey: userMetadataTable.totpKey })
                    .from(userMetadataTable)
                    .where(eq(userMetadataTable.userId, ctx.session.userId));

                if (userSecret === null || userSecret.length === 0) {
                    return false;
                }
                if (userSecret[0] == undefined || userSecret[0]?.totpKey === null) {
                    return false;
                }

                secret = userSecret[0].totpKey;
            }

            // 2. verify code
            const valid = totpService.verifyCode(input.code, secret);

            // 3. set the record in the session
            await db.update(sessionTable)
                .set({ twoFactorVerified: true })
                .where(eq(sessionTable.userId, ctx.session.userId));

            return valid;
        }),

    verifySession: publicProcedure
        .input(z.object({ session: z.string() }))
        .query(async ({ input }) => {
            const { session, user } = await validateSessionToken(input.session);
            if (!session || !user) {
                return null;
            }
            return { id: user.id };
        }),

    updateProfile: protectedProcedure
        .input(z.object({
            form: z.object({
                lastName: z.string().min(2).max(50),
                firstName: z.string().min(2).max(50),
                bio: z.string(),
                isPublic: z.boolean(),
            })
        })).mutation(async ({ ctx, input }) => {
            return await db.update(userMetadataTable).set({
                name: input.form.firstName + " " + input.form.lastName,
                bio: input.form.bio,
                isPublic: input.form.isPublic
            }).where(eq(userMetadataTable.userId, ctx.session.userId));
        }),

    getWorkspaces: protectedProcedure
        .query(async ({ ctx }) => {
            const cacheKey = `workspaces:${ctx.session.userId}`;

            // first try to check if it's cached
            const cachedWorkspaces = await cacheService.getItem(cacheKey);
            if (cachedWorkspaces !== null) {
                return cachedWorkspaces as typeof workspaces;
            }

            // otherwise fetch it from the database, and cache for 30s more
            const workspaces = await db.query.workspaceTable.findMany({
                where: eq(workspaceTable.userId, ctx.session.userId),
                with: {
                    projects: {
                        with: {
                            notes: {
                                with: {
                                    tags: true
                                }
                            }
                        }
                    }
                }
            });

            await cacheService.insertItem(cacheKey, workspaces);

            return workspaces;
        }),

    delete: protectedProcedure
        .mutation(async ({ ctx }) => {
            const userId = ctx.session.userId;

            // delete in correct order due to foreign key constraints
            await db.transaction(async (tx) => {
                await tx.delete(noteTable)
                    .where(eq(noteTable.userId, userId));

                await tx.delete(tagTable)
                    .where(eq(tagTable.userId, userId));

                await tx.delete(projectTable)
                    .where(eq(projectTable.userId, userId));

                await tx.delete(workspaceTable)
                    .where(eq(workspaceTable.userId, userId));

                await tx.delete(sessionTable)
                    .where(eq(sessionTable.userId, userId));

                await tx.delete(userMetadataTable)
                    .where(eq(userMetadataTable.userId, userId));

                await tx.delete(userTable)
                    .where(eq(userTable.id, userId));

                await tx.execute(sql`commit`);
            });

            return true;
        }),

    getPublicProfile: publicProcedure
        .input(z.object({ name: z.string() }))
        .query(async ({ input }) => {
            const profile = await db.query.userMetadataTable.findFirst({
                where: and(
                    eq(userMetadataTable.name, input.name),
                    eq(userMetadataTable.isPublic, true)
                ),
            });

            if (!profile) {
                // Profile not found or is private
                return undefined;
            }

            const projects = await db.query.projectTable.findMany({
                where: and(
                    eq(projectTable.isPublic, true),
                    eq(projectTable.userId, profile.userId)
                ),
                // columns: {
                //     id: true,
                //     name: true,
                //     description: true,
                //     createdAt: true,
                //     updatedAt: true
                // },

                // to get the author's name
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
            })

            return {
                metadata: profile,
                projects: projects
            };
        }),

    getQuickNotes: protectedProcedure
        .query(async ({ ctx }) => {
            const cacheKey = `quick_notes:${ctx.session.userId}`;

            // first try to check if it's cached
            const cachedNotes = await cacheService.getItem(cacheKey);
            if (cachedNotes !== null) {
                return cachedNotes as typeof notes;
            }

            const notes = await db.query.noteTable.findMany({
                where: or(
                    eq(noteTable.userId, ctx.session.userId),
                    eq(noteTable.type, 'newsfeed')
                ),

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
                },

                columns: {
                    type: true,
                    name: true,
                    id: true,
                    createdAt: true,
                    textContent: true
                },

                orderBy: desc(noteTable.createdAt)
            });

            await cacheService.insertItem(cacheKey, notes);

            return notes;
        }),


    getTags: protectedProcedure
        .query(async ({ ctx }) => {
            return await db.query.tagTable.findMany({
                where: eq(tagTable.userId, ctx.session.userId),

                columns: {
                    id: true,
                    name: true
                }
            })
        }),
    addTag: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input, ctx }) => {
            return await db.insert(tagTable).values({
                name: input.name,
                userId: ctx.session.userId,
            });
        }),
    removeTag: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
            return await db.delete(tagTable)
                .where(and(eq(tagTable.userId, ctx.session.userId), eq(tagTable.id, input.id)));
        }),

    trackUsage: publicProcedure
        .input(z.object({
            // we do this, since the request from uploadthing is not authed
            userId: z.number(),

            promptTokens: z.number().default(0).optional(),
            completionTokens: z.number().default(0).optional(),
            fileSize: z.number().default(0).optional()
        }))
        .mutation(async ({ input }) => {
            return await db.insert(usageTable)
                .values({
                    promptTokens: input.promptTokens,
                    completionTokens: input.completionTokens,
                    fileSize: input.fileSize,

                    userId: input.userId
                });
        }),
    getUsage: protectedProcedure
        .query(async ({ ctx }) => {
            return await db.select()
                .from(usageTable)
                .where(eq(usageTable.userId, ctx.session.userId));
        }),

    upsertConversation: protectedProcedure
        .input(z.object({ id: z.string(), messages: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const isPresent = await db.select({ id: conversationTable.id }).from(conversationTable)
                .where(and(
                    eq(conversationTable.userId, ctx.session.userId),
                    eq(conversationTable.id, input.id)
                ));

            const messages = JSON.parse(input.messages);

            if (isPresent === undefined || isPresent.length === 0) {
                // insert the convo with the first message

                // todo: in the future use a model to summarize the conversation...
                const name = JSON.parse(messages.messages)[0].content.substring(0, 17);

                return await db.insert(conversationTable)
                    .values({
                        id: input.id,
                        name: name,
                        userId: ctx.session.userId,
                        messages: messages,
                    });
            }

            // update the conversation with the new message
            return await db.update(conversationTable)
                .set({
                    messages: messages
                })
                .where(and(
                    eq(conversationTable.userId, ctx.session.userId),
                    eq(conversationTable.id, input.id)
                ));
        }),
    getConversations: protectedProcedure
        .query(async ({ ctx }) => {
            return await db.select({ id: conversationTable.id, name: conversationTable.name, createdAt: conversationTable.createdAt })
                .from(conversationTable)
                .where(
                    eq(conversationTable.userId, ctx.session.userId)
                );
        }),
    getConversation: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return await db.select()
                .from(conversationTable)
                .where(and(
                    eq(conversationTable.userId, ctx.session.userId),
                    eq(conversationTable.id, input.id)
                ));
        })
})
