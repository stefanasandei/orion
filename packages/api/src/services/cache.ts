import { Redis } from "@upstash/redis";
import { redis } from "./redis";

export class CacheService {
    private redis: Redis;
    private cacheMap: Map<string, number>;

    constructor(redis: Redis) {
        this.redis = redis;
        this.cacheMap = new Map();
    }

    public async getItem(key: string): Promise<unknown | null> {
        if (!this.isItemCached(key)) {
            return null;
        }

        const cachedItem = await this.redis.get(key);
        if (!cachedItem) {
            this.cacheMap.delete(key);
            return null;
        }

        return cachedItem;
    }

    public async insertItem(key: string, item: unknown) {
        const ttlSeconds = 30;
        const expiryTime = Date.now() + (ttlSeconds * 1000);

        await this.redis.setex(key, ttlSeconds, item);
        this.cacheMap.set(key, expiryTime);
    }

    private isItemCached(key: string): boolean {
        const expiryTime = this.cacheMap.get(key);
        if (!expiryTime) return false;

        const now = Date.now();
        if (now > expiryTime) {
            this.cacheMap.delete(key);
            return false;
        }
        return true;
    }

    public cleanupExpiredItems(): void {
        const now = Date.now();
        for (const [key, expiryTime] of this.cacheMap.entries()) {
            if (now > expiryTime) {
                this.cacheMap.delete(key);
            }
        }
    }
}

export const cacheService = new CacheService(redis);
