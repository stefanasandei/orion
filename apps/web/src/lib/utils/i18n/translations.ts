import i18n from 'sveltekit-i18n';
import type { Config } from "sveltekit-i18n";

const config: Config = ({
    loaders: [
        {
            locale: 'en',
            key: 'common',
            loader: async () => (
                await import('./en/common.json')
            ).default,
        },
        {
            locale: 'en',
            key: 'marketing',
            loader: async () => (
                await import('./en/marketing.json')
            ).default,
        },
        {
            locale: 'en',
            key: 'auth',
            loader: async () => (
                await import('./en/auth.json')
            ).default,
        },
        {
            locale: 'en',
            key: 'dashboard',
            loader: async () => (
                await import('./en/dashboard.json')
            ).default,
        },
    ],
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
