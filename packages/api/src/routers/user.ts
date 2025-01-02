import { generateSessionToken, createSession, setSessionTokenCookie, invalidateSession, deleteSessionTokenCookie } from '@repo/auth';
import { db, userMetadataTable, userTable } from '@repo/db';
import { createRouter, publicProcedure } from '../context'
import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from '@trpc/server';

export const userRouter = createRouter({
    register: publicProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // todo: more validation and error handling; move this to @repo/auth

            // 1. validate data - done by zod

            // 2. insert user (and his metadata) in the database
            const newUser = await db.insert(userTable)
                .values({})
                .returning({ id: userTable.id });

            await db.insert(userMetadataTable).values({
                name: input.name,
                email: input.email,
                passwordHash: input.password,
                userId: newUser[0]!.id
            });

            // 3. create the session and set the cookie
            const token = generateSessionToken();
            const session = createSession(token, newUser[0]!.id);
            setSessionTokenCookie(ctx.event, token, (await session).expiresAt);
        }),
    login: publicProcedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // todo: more validation and error handling; move this to @repo/auth

            // 1. validate data - done by zod

            // 2. check user credentials
            const user = await db.select({ id: userMetadataTable.userId, passwordHash: userMetadataTable.passwordHash })
                .from(userMetadataTable)
                .where(eq(userMetadataTable.email, input.email))

            if (user[0]!.passwordHash != input.password) {
                return new TRPCError({ message: "wrong password", code: 'UNAUTHORIZED' })
            }

            // 3. all good - login user
            const token = generateSessionToken();
            const session = createSession(token, user[0]!.id);
            setSessionTokenCookie(ctx.event, token, (await session).expiresAt);
        }),
    logout: publicProcedure
        .mutation(async ({ ctx }) => {
            // delete the session and its cookie
            invalidateSession(ctx.event.locals.session.id);
            deleteSessionTokenCookie(ctx.event);
        })
})
