import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export class RateLimitService {
    redis: Redis;
    limiter: Ratelimit; // for time-based limiting
    attempts: number;

    constructor(redis: Redis, attempts: number = 5) {
        this.redis = redis;

        // allow 10 requests every 10 seconds
        this.limiter = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(10, "10 s"),
            prefix: "@upstash/ratelimit"
        })

        this.attempts = attempts;
    }

    async recordAction(identifier: string): Promise<boolean> {
        // for expensive & time sensitive operations

        const { success } = await this.limiter.limit(identifier);

        // true - rate limited
        return !success;
    }

    async recordAuthAttempt(ip: string): Promise<boolean> {
        // allows a maximum of failed attempts
        // afterwards require the user to do a captcha

        const EXPIRE_TIME = 60 * 60; // 1 hour

        // get the current values
        const key = `rate-limit:${ip}`;
        const current = await this.redis.get<number>(key);
        if (current === null) {
            await this.redis.set(key, 1, {
                ex: EXPIRE_TIME,
            });
            return true;
        }

        // increment the value
        await this.redis.set(key, current + 1, {
            ex: EXPIRE_TIME,
        });

        // check if the user reached the limit
        // true - rate limited
        return current >= this.attempts;
    }
}

export const ratelimit = new RateLimitService(redis, 2);
