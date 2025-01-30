import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from 'dotenv'
dotenv.config()

export const env = createEnv({
    server: {
        PUBLIC_WEBSITE_URL: z.string().url(),

        DATABASE_URL: z.string().url().nonempty(),

        GITHUB_CLIENT_ID: z.string().nonempty(),
        GITHUB_CLIENT_SECRET: z.string().nonempty(),

        UPSTASH_REDIS_REST_URL: z.string().nonempty(),
        UPSTASH_REDIS_REST_TOKEN: z.string().nonempty(),

        PUBLIC_RECAPTCHA_SITE_KEY: z.string().nonempty(),
        RECAPTCHA_SECRET_KEY: z.string().nonempty(),

        RESEND_API_KEY: z.string().nonempty(),
        EMAIL_SECRET: z.string().nonempty(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});