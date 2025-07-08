import { expect, test, describe, vi, beforeEach } from 'vitest';
import { CacheService } from '@repo/api/services/server';

describe('CacheService', () => {
    let redisMock: any;
    let cache: CacheService;
    beforeEach(() => {
        redisMock = {
            get: vi.fn(),
            setex: vi.fn(),
            del: vi.fn(),
        };
        cache = new CacheService(redisMock);
    });

    test('returns null if item is not cached', async () => {
        const result = await cache.getItem('foo');
        expect(result).toBeNull();
        expect(redisMock.get).not.toHaveBeenCalled();
    });

    test('returns cached item if present and not expired', async () => {
        await cache.insertItem('foo', 'bar');
        redisMock.get.mockResolvedValueOnce('bar');
        const result = await cache.getItem('foo');
        expect(redisMock.get).toHaveBeenCalledWith('foo');
        expect(result).toBe('bar');
    });

    test('removes from cacheMap if redis returns null', async () => {
        await cache.insertItem('foo', 'bar');
        redisMock.get.mockResolvedValueOnce(null);
        const result = await cache.getItem('foo');
        expect(result).toBeNull();
    });

    test('insertItem sets correct TTL and expiry', async () => {
        const now = Date.now();
        vi.spyOn(Date, 'now').mockReturnValue(now);
        await cache.insertItem('foo', 'bar', false);
        expect(redisMock.setex).toHaveBeenCalledWith('foo', 60, 'bar');
        await cache.insertItem('baz', 'qux', true);
        expect(redisMock.setex).toHaveBeenCalledWith('baz', 600, 'qux');
    });

    test('invalidateItem deletes from redis and cacheMap', async () => {
        await cache.insertItem('foo', 'bar');
        await cache.invalidateItem('foo');
        expect(redisMock.del).toHaveBeenCalledWith('foo');
        // cacheMap should not have 'foo' anymore
        expect((cache as any).cacheMap.has('foo')).toBe(false);
    });

    test('isItemCached returns false if expired', async () => {
        const now = Date.now();
        vi.spyOn(Date, 'now').mockReturnValue(now);
        await cache.insertItem('foo', 'bar');
        // Advance time past expiry
        vi.spyOn(Date, 'now').mockReturnValue(now + 61 * 1000);
        // @ts-ignore
        expect(cache.isItemCached('foo')).toBe(false);
    });

    test('cleanupExpiredItems removes expired keys', async () => {
        const now = Date.now();
        vi.spyOn(Date, 'now').mockReturnValue(now);
        await cache.insertItem('foo', 'bar');
        vi.spyOn(Date, 'now').mockReturnValue(now + 61 * 1000);
        cache.cleanupExpiredItems();
        expect((cache as any).cacheMap.has('foo')).toBe(false);
    });
});
