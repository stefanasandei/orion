import { persisted } from 'svelte-persisted-store'

type Theme = 'light' | 'dark';

interface Preferences {
    theme: Theme;
}

export const preferences = persisted<Preferences>('preferences', {
    theme: typeof window !== 'undefined'
        ? window?.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
        : 'light'
});