import { db, userMetadataTable, userTable, workspaceTable, projectTable, noteTable, projectPostTable, tagTable, commentTable } from "@/index";
import data from "./data.json";

const name2id = new Map<string, number>();
const workspace2id = new Map<string, number>();
const project2id = new Map<string, number>();
const note2id = new Map<string, number>();

type NoteType = "document" | "thought" | "file" | "task" | "newsfeed";

// 1. insert users
for (let userMetadata of data.userMetadata) {
    const newUser = await db.insert(userTable).values({}).returning();
    const newUserId = newUser[0]!.id;

    await db.insert(userMetadataTable).values({
        userId: newUserId,
        ...userMetadata
    });

    name2id.set(userMetadata.name, newUserId);
}

// 2. create workspaces
for (let workspace of data.workspaces) {
    const newWorkspace = await db.insert(workspaceTable).values({
        userId: name2id.get(workspace.forUsername)!,
        name: workspace.name
    }).returning();

    workspace2id.set(`${workspace.forUsername}:${workspace.name}`, newWorkspace[0]!.id);
}

// 3. create projects
for (let project of data.projects) {
    const workspaceKey = `${project.forUsername}:${project.forWorkspace}`;
    const newProject = await db.insert(projectTable).values({
        userId: name2id.get(project.forUsername)!,
        workspaceId: workspace2id.get(workspaceKey)!,
        name: project.name,
        description: project.description,
        isPublic: project.isPublic
    }).returning();

    const projectId = newProject[0]!.id;

    // Create project post for public projects
    if (project.isPublic) {
        const newPost = await db.insert(projectPostTable).values({
            projectId: projectId
        }).returning();

        // Add comments
        if (project.comments) {
            for (let comment of project.comments) {
                await db.insert(commentTable).values({
                    postId: newPost[0]!.id,
                    userId: name2id.get(comment.from)!,
                    content: comment.content
                });
            }
        }
    }

    // Add tags
    if (project.tags) {
        for (let tagName of project.tags) {
            await db.insert(tagTable).values({
                name: tagName,
                userId: name2id.get(project.forUsername)!,
                projectId: projectId
            }).returning();
        }
    }

    project2id.set(`${project.forUsername}:${project.name}`, projectId);
}

// 4. create notes
for (let note of data.notes) {
    const userId = note.forUsername ? name2id.get(note.forUsername) : undefined;
    const projectId = note.forProject ? project2id.get(`${note.forUsername}:${note.forProject}`) : undefined;

    // For hierarchical notes, we need to process them after their parents
    if (note.parentNote) {
        continue;
    }

    const newNote = await db.insert(noteTable).values({
        userId: userId!,
        projectId: projectId,
        type: note.type as NoteType,
        name: note.name,
        jsonContent: note.jsonContent || '',
        htmlContent: note.htmlContent || '',
        textContent: note.textContent || note.name,
    }).returning();

    if (note.forUsername) {
        note2id.set(`${note.forUsername}:${note.name}`, newNote[0]!.id);
    }
}

// 5. create hierarchical notes (ones with parents)
for (let note of data.notes) {
    if (!note.parentNote) continue;

    const userId = note.forUsername ? name2id.get(note.forUsername) : undefined;
    const projectId = note.forProject ? project2id.get(`${note.forUsername}:${note.forProject}`) : undefined;
    const parentId = note2id.get(`${note.forUsername}:${note.parentNote}`);

    const newNote = await db.insert(noteTable).values({
        userId: userId!,
        projectId: projectId,
        parentNote: parentId,
        type: note.type as NoteType,
        name: note.name,
        jsonContent: note.jsonContent || '',
        htmlContent: note.htmlContent || '',
        textContent: note.textContent || note.name,
    }).returning();

    note2id.set(`${note.forUsername}:${note.name}`, newNote[0]!.id);
}

console.log("Done! ✅");
