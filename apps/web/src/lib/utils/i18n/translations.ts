import i18n from 'sveltekit-i18n';
import type { Config } from "sveltekit-i18n";

const translations = ['common', 'marketing', 'auth', 'dashboard', 'settings', 'project', 'editor']

const config: Config = ({
    loaders: [
        ...translations.map((t) => {
            return {
                locale: 'en',
                key: t,
                loader: async () => (
                    await import(`./en/${t}.json`)
                ).default,
            }
        }),
        ...translations.map((t) => {
            return {
                locale: 'ro',
                key: t,
                loader: async () => (
                    await import(`./ro/${t}.json`)
                ).default,
            }
        })
    ]
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
