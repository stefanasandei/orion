import { loadTranslations } from '@/utils/i18n/translations';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ url }) => {
    const { pathname } = url;

    // load locales for i18n 
    const initLocale = 'en';
    await loadTranslations(initLocale, pathname);

    return {};
}
