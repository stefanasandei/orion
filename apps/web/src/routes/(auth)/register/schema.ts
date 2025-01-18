import { z } from "zod";

export const registerFormSchema = z.object({
    lastName: z.string().min(2).max(50),
    firstName: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50),
});
