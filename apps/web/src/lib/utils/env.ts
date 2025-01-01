import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from 'dotenv'
dotenv.config()

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url().nonempty(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});