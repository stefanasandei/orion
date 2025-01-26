import { Redis } from '@upstash/redis'
import process from "process";

const redis = new Redis({
    url: process.env["UPSTASH_REDIS_REST_URL"],
    token: process.env["UPSTASH_REDIS_REST_TOKEN"],
})

export { redis }
