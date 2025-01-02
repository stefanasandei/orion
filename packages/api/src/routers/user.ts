import { registerUser, loginUser, logoutUser } from '@repo/auth';
import { createRouter, publicProcedure } from '../context'
import { z } from "zod";

export const userRouter = createRouter({
    register: publicProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return registerUser(input, ctx.event);
        }),
    login: publicProcedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return loginUser(input, ctx.event);
        }),
    logout: publicProcedure
        .mutation(async ({ ctx }) => {
            return logoutUser(ctx.event);
        })
})
