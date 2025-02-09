import { PersistedState } from "runed";

export const languageOptions = ["en", "ro"] as const;
export type LanguageOptions = (typeof languageOptions)[number];

export const language = new PersistedState<LanguageOptions>("language", "en");

export const activeWorkspaceId = new PersistedState<number>("workspace_id", -1);
