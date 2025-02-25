import { z } from "zod";

export const projectFormSchema = z.object({
    projectId: z.number(),
    name: z.string().min(2).max(50),
    description: z.string().nullable(),
    isPublic: z.boolean().default(false),
});

export type ProjectFormSchema = typeof projectFormSchema;
