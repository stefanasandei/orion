import { PersistedState } from "runed";
import { browser } from "$app/environment";
import { writable } from 'svelte/store';
import type { Note } from "@repo/db";

// language
export const languageOptions = ["en", "ro"] as const;
export type LanguageOptions = (typeof languageOptions)[number];

export const language = new PersistedState<LanguageOptions>("language", "en");

// workspace
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

// document editor
export type EditorTab = {
    noteId: number;
    title: string;
    content: string;
    isDirty: boolean;
};

export const editorState = new PersistedState<{ tabs: EditorTab[] }>("editor_tabs", { tabs: [] });

export function initializeActiveNote(note: Note) {
    // Only run on client-side
    if (!browser) return;

    // is the note already in the tabs?
    const isThereIdx = editorState.current.tabs.findIndex(t => t.noteId === note.id);

    if (isThereIdx == -1) {
        // add the note
        editorState.current = {
            tabs: [...editorState.current.tabs, {
                noteId: note.id,
                title: note.name,
                content: note.content,
                isDirty: false
            }]
        };
    }
}

export function closeNoteTab(noteId: number) {
    // Only run on client-side
    if (!browser) return;

    editorState.current = {
        tabs: editorState.current.tabs.filter(t => t.noteId !== noteId)
    };
}
