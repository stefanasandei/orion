import { PersistedState } from "runed";
import { browser } from "$app/environment";

export const languageOptions = ["en", "ro"] as const;
export type LanguageOptions = (typeof languageOptions)[number];

export const language = new PersistedState<LanguageOptions>("language", "en");

export const activeWorkspaceId = new PersistedState<number>("workspace_id", -1);

export function initializeActiveWorkspace(workspaces: { id: number }[]) {
    // Only run on client-side
    if (!browser) return;

    // If no workspaces, reset to -1
    if (workspaces.length === 0) {
        activeWorkspaceId.current = -1;
        return;
    }

    // If current workspace is -1 or not in the list of workspaces, set to first workspace
    if (activeWorkspaceId.current === -1 || !workspaces.some(w => w.id === activeWorkspaceId.current)) {
        activeWorkspaceId.current = workspaces[0].id;
    }
}
