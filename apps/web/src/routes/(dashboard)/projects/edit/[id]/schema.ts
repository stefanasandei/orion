import { z } from "zod";

export const projectFormSchema = z.object({
    projectId: z.number(),
    name: z.string().min(2).max(50),
    description: z.string().nullable(),
});

export type ProjectFormSchema = typeof projectFormSchema;
