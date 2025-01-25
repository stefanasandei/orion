import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().default(true),
});

export type LoginFormSchema = typeof loginFormSchema;
