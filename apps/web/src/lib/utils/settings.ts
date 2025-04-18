import { preferences } from './stores';

export type Theme = 'light' | 'dark';
export type DashboardLayout = 'clean' | 'activity-grid';

export function setTheme(theme: Theme) {
    preferences.update((prefs) => ({ ...prefs, theme }));
    // Update the document class for theme
    if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }
}

export function setDashboardLayout(layout: DashboardLayout) {
    preferences.update((prefs) => ({ ...prefs, dashboard: layout }));
}
