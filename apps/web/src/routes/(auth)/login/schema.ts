import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
});

export type LoginFormSchema = typeof loginFormSchema;
