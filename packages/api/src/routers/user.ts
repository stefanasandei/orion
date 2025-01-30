import { registerUser, loginUser, logoutUser, AuthFailReason } from '@repo/auth';
import { createRouter, protectedProcedure, publicProcedure } from '../context'
import { z } from "zod";
import { ratelimit } from '../services/ratelimit';
import { db, userMetadataTable } from '@repo/db';
import { eq } from 'drizzle-orm';
import process from "process";
import jwt from "jsonwebtoken";
import { resendService } from '../services/email';

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
            const userEmail = ctx.event.locals.userMetadata.email;
            const htmlContent = `Please click this email to confirm your email: <a href="${url}">${url}</a>`;

            const success = await resendService.send([userEmail], "Confirm your email", htmlContent);

            // 3. return response
            return success;
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
})
