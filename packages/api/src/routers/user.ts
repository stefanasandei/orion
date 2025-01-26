import { registerUser, loginUser, logoutUser, AuthFailReason } from '@repo/auth';
import { createRouter, publicProcedure } from '../context'
import { z } from "zod";
import { ratelimit } from '../services/ratelimit';

export const userRouter = createRouter({
    register: publicProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return registerUser(input, ctx.event);
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
    logout: publicProcedure
        .mutation(async ({ ctx }) => {
            return logoutUser(ctx.event);
        })
})
