import { relations } from 'drizzle-orm';
import { noteTable, projectTable, sessionTable, tagTable, userMetadataTable, userTable, workspaceTable } from './schema';

export const userRelations = relations(userTable, ({ one, many }) => ({
    metadata: one(userMetadataTable),
    session: one(sessionTable),

    workspaces: many(workspaceTable),
    tags: many(tagTable),
    projects: many(projectTable),
    notes: many(noteTable)
}));

export const workspaceRelations = relations(workspaceTable, ({ many }) => ({
    projects: many(projectTable)
}));

export const projectRelations = relations(projectTable, ({ many }) => ({
    notes: many(noteTable),
    tags: many(tagTable)
}));

export const noteRelations = relations(noteTable, ({ many }) => ({
    tags: many(tagTable),
    childProjects: many(projectTable)
}));
