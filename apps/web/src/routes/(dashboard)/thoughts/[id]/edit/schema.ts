import { z } from "zod";

export const formSchema = z.object({
    thought: z.string().min(1),
    tags: z.array(z.object({ id: z.number(), label: z.string() })),
});

export type FormSchema = typeof formSchema;
