import { z } from 'zod';
export const formSchema = z.object({
    pin: z.string().length(6, {
        message: 'Your one-time password must be 6 characters.'
    })
});
export type FormSchema = typeof formSchema;