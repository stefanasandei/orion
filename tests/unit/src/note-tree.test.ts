import { expect, test, describe } from 'vitest';
import { NoteTreeService, NoteTreeNode, VizTree } from '@repo/api/services';

describe('NoteTreeService', () => {
    const notes = [
        { id: 1, name: 'Root', parentNote: null },
        { id: 2, name: 'Child A', parentNote: 1 },
        { id: 3, name: 'Child B', parentNote: 1 },
        { id: 4, name: 'Grandchild', parentNote: 2 },
        { id: 5, name: 'Orphan', parentNote: 999 },
        { id: 6, name: 'Another Root', parentNote: null },
    ] as NoteTreeNode[];

    test('buildTree creates correct tree structure', () => {
        const tree = NoteTreeService.buildTree(notes as any);
        expect(tree).toHaveLength(3); // Root, Orphan, Another Root
        const root = tree.find(n => n.name === 'Root');
        expect(root?.children.map(c => c.name).sort()).toEqual(['Child A', 'Child B']);
        const childA = root?.children.find(c => c.name === 'Child A');
        expect(childA?.children[0].name).toBe('Grandchild');
    });

    test('children and roots are sorted alphabetically', () => {
        const tree = NoteTreeService.buildTree(notes as any);
        expect(tree.map(n => n.name)).toEqual(['Another Root', 'Orphan', 'Root']);
        const root = tree.find(n => n.name === 'Root');
        expect(root?.children.map(c => c.name)).toEqual(['Child A', 'Child B']);
    });

    test('toVizFormat produces correct VizTree structure', () => {
        const tree = NoteTreeService.buildTree(notes as any);
        const viz = NoteTreeService.toVizFormat(tree);
        expect(Array.isArray(viz.tree)).toBe(true);
        // Check a root node
        const root = viz.tree.find((t: VizTree) => Array.isArray(t) && t[0].name === 'Root');
        expect(root).toBeDefined();
        // Check leaf node
        const orphan = viz.tree.find((t: VizTree) => !Array.isArray(t) && t.name === 'Orphan');
        expect(orphan).toBeDefined();
    });
});
