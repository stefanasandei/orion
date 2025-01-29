import { z } from "zod";

export const formSchema = z.object({
    lastName: z.string().min(2).max(50),
    firstName: z.string().min(2).max(50),
    bio: z.string(),
    isPublic: z.boolean(),
});

export type ProfileFormSchema = typeof formSchema;
