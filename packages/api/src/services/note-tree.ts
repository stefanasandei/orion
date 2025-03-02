import { Note } from "@repo/db";

export type NoteTreeNode = {
    children: NoteTreeNode[];
} & Note;

export type VizItem = { name: string; id: number };
export type VizTree = VizItem | [VizItem, ...VizTree[]];

export class NoteTreeService {
    static buildTree(notes: Array<Note>): NoteTreeNode[] {
        const noteMap: Record<number, NoteTreeNode> = {};
        const roots: NoteTreeNode[] = [];

        // Create a mapping from note id to a tree node.
        notes.forEach((note) => {
            noteMap[note.id] = {
                ...note,
                children: []
            };
        });

        // Link each note into its parent's children array if applicable.
        notes.forEach((note) => {
            if (note.parentNote != null) {
                const parent = noteMap[note.parentNote];
                if (parent) {
                    parent.children.push(noteMap[note.id]!);
                } else {
                    // In case the parent note isn't found, treat it as a root.
                    roots.push(noteMap[note.id]!);
                }
            } else {
                // No parent means this note is a root node.
                roots.push(noteMap[note.id]!);
            }
        });

        // Sort all children arrays alphabetically
        Object.values(noteMap).forEach((node) => {
            node.children.sort((a, b) => a.name.localeCompare(b.name));
        });

        // Sort root nodes alphabetically
        roots.sort((a, b) => a.name.localeCompare(b.name));

        return roots;
    }

    static toVizFormat(noteTree: NoteTreeNode[]): { tree: VizTree[] } {
        // Recursive helper to convert a single NoteTreeNode into a VizTree.
        const convert = (node: NoteTreeNode): VizTree => {
            const current: VizItem = { name: node.name, id: node.id };
            if (node.children.length > 0) {
                // If the node has children, return an array whose first element
                // is the current node and the rest are its converted children.
                return [current, ...node.children.map(convert)];
            }
            // If no children, return the node as a simple VizItem.
            return current;
        };

        return { tree: noteTree.map(convert) };
    }
}
