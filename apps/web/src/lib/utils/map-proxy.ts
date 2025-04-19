// used so we can use Map in a state object, and later bind: that to an element

export function mapProxy<K, V>(obj: Map<K, V>): Map<K, V> & Record<string | number | symbol, V> {
    const parseProp = (prop: string | symbol): K | string | symbol => {
        if (typeof prop === 'symbol') return prop;
        const parsed = parseInt(prop as string);
        return (isNaN(parsed) ? prop : parsed) as K;
    };

    const handler: ProxyHandler<Map<K, V>> = {
        get(target: Map<K, V>, prop: string | symbol) {
            if (prop in Object.getPrototypeOf(target)) {
                const value = target[prop as keyof typeof target];
                if (typeof value === 'function') return value.bind(target);
                return value;
            }

            const key = parseProp(prop);
            const value = target.get(key as K);
            return typeof value === 'object' ? mapProxy(value as any) : value;
        },
        set(target: Map<K, V>, prop: string | symbol, value: V) {
            const key = parseProp(prop);
            target.set(key as K, value);
            return true;
        }
    };

    return new Proxy(obj, handler) as Map<K, V> & Record<string | number | symbol, V>;
}

// it's this https://stackoverflow.com/a/76932061 + typescript
