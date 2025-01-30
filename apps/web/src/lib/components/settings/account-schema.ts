import { z } from "zod";

export const formSchema = z.object({
    language: z.enum(["English", "Romanian"]),
});

export type AccountFormSchema = typeof formSchema;