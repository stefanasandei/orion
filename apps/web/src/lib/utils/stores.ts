import { persisted } from 'svelte-persisted-store';
import type { Theme, DashboardLayout } from './settings';

interface Preferences {
    theme: Theme;
    dashboard: DashboardLayout;
    useRichTextEditor: boolean;
}

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const preferences = persisted<Preferences>('preferences', {
    theme: getInitialTheme(),
    dashboard: 'clean',
    useRichTextEditor: true
});

export const lastVerificationEmailSent = persisted<number>('lastVerificationEmailSent', 0);
