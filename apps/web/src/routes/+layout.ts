import { loadTranslations } from '$base/src/lib/utils/i18n/translations';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ url }) => {
    const { pathname } = url;

    const initLocale = 'en';

    await loadTranslations(initLocale, pathname);

    return {};
}
