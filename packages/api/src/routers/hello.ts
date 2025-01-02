import { db, userTable } from '@repo/db';
import { createRouter, publicProcedure } from '../context'
import { z } from "zod";
import { generateSessionToken, createSession, setSessionTokenCookie, invalidateSession, deleteSessionTokenCookie } from '@repo/auth';

export const helloRouter = createRouter({
    msg: publicProcedure.query(({ }) => {
        return {
            message: `Hello, world from tRPC!`,
        }
    }),
    processName: publicProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ input: _input, ctx }) => {
            // return { message: `Hello, ${_input.name} from tRPC!` };

            // const res = await db.select().from(userTable);
            // return res;

            // user, session and more here
            return ctx.event;
        }),
    // only for testing
    login: publicProcedure
        .mutation(async ({ ctx }) => {
            // const token = generateSessionToken();
            // const session = createSession(token, 1); // userId 1
            // setSessionTokenCookie(ctx.event, token, (await session).expiresAt);
        }),
    logout: publicProcedure
        .mutation(async ({ ctx }) => {
            invalidateSession(ctx.event.locals.session.id);
            deleteSessionTokenCookie(ctx.event);
        })
})
