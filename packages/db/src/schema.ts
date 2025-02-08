import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTableCreator, serial, boolean, text, timestamp, varchar, AnyPgColumn } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `orion_${name}`);

// Tables

export const userTable = pgTable("user", {
    id: serial("id").primaryKey(),
    githubId: integer("github_id").unique(),
});

export const userMetadataTable = pgTable("user_metadata", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date"
    })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "date"
    })
        .notNull()
        .$onUpdate(() => new Date()),

    rememberMe: boolean("remember_me")
        .default(false).notNull(),
    emailVerified: boolean("email_verified")
        .default(false),
    twoFactorEnabled: boolean("two_factor_enabled")
        .default(false),
    totpKey: varchar("totp_key", { length: 64 }),

    name: varchar("name", { length: 64 })
        .notNull(),
    email: varchar("email", { length: 64 })
        .notNull(),
    passwordHash: varchar("password_hash", { length: 256 })
        .notNull(),
    bio: text("bio")
        .default("").notNull(),
    isPublic: boolean("is_public")
        .default(false).notNull(),
})

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),

    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull(),

    twoFactorVerified: boolean("two_factor_verified")
        .default(false)
        .notNull(),
});

export const workspaceTable = pgTable("workspace", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),

    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date"
    })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "date"
    })
        .notNull()
        .$onUpdate(() => new Date()),

    name: varchar("name", { length: 64 }),
    isFreePlan: boolean("is_free_plan")
        .default(true).notNull()
})

export const tagTable = pgTable("tag", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),

    noteId: integer("note_id")
        .references(() => noteTable.id),
    projectId: integer("project_id")
        .references(() => projectTable.id),

    name: varchar("name", { length: 64 })
        .notNull(),
    color: varchar("color", { length: 64, enum: ["white", "red", "green", "blue", "yellow", "orange", "purple"] })
        .default("white").notNull()
})

export const projectTable = pgTable("project", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),
    workspaceId: integer("workspace_id")
        .notNull()
        .references(() => workspaceTable.id),

    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "date"
    })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "date"
    })
        .notNull()
        .$onUpdate(() => new Date()),

    name: varchar("name", { length: 64 })
        .notNull(),
    description: text("description"),
})

export const noteTable = pgTable("note", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),
    projectId: integer("project_id")
        .references(() => projectTable.id),

    isQuickThought: boolean("is_thought")
        .notNull(),

    name: varchar("name", { length: 64 })
        .notNull(),
    content: text("content")
        .notNull(),
    description: text("description"),

    parentNote: integer("parent_id")
        .references((): AnyPgColumn => noteTable.id),
})

// Relations
export const userRelations = relations(userTable, ({ one, many }) => ({
    metadata: one(userMetadataTable, {
        fields: [userTable.id],
        references: [userMetadataTable.userId]
    }),
    session: one(sessionTable, {
        fields: [userTable.id],
        references: [sessionTable.userId]
    }),
    workspaces: many(workspaceTable),
    tags: many(tagTable),
    projects: many(projectTable),
    notes: many(noteTable)
}));

export const workspaceRelations = relations(workspaceTable, ({ one, many }) => ({
    user: one(userTable, {
        fields: [workspaceTable.userId],
        references: [userTable.id]
    }),
    projects: many(projectTable)
}));

export const projectRelations = relations(projectTable, ({ one, many }) => ({
    workspace: one(workspaceTable, {
        fields: [projectTable.workspaceId],
        references: [workspaceTable.id]
    }),
    user: one(userTable, {
        fields: [projectTable.userId],
        references: [userTable.id]
    }),
    notes: many(noteTable)
}));

export const noteRelations = relations(noteTable, ({ one, many }) => ({
    project: one(projectTable, {
        fields: [noteTable.projectId],
        references: [projectTable.id]
    }),
    user: one(userTable, {
        fields: [noteTable.userId],
        references: [userTable.id]
    }),
    parent: one(noteTable, {
        fields: [noteTable.parentNote],
        references: [noteTable.id],
        relationName: "note_parent"
    }),
    tags: many(tagTable),
    // children: many(noteTable, {
    //     relationName: "note_children"
    // })
}));

export const tagRelations = relations(tagTable, ({ one }) => ({
    note: one(noteTable, {
        fields: [tagTable.noteId],
        references: [noteTable.id]
    }),
    project: one(projectTable, {
        fields: [tagTable.projectId],
        references: [projectTable.id]
    }),
    user: one(userTable, {
        fields: [tagTable.userId],
        references: [userTable.id]
    })
}));

// Types
export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type UserMetadata = InferSelectModel<typeof userMetadataTable>

export type Workspace = InferSelectModel<typeof workspaceTable>
export type Tag = InferSelectModel<typeof tagTable>
export type Project = InferSelectModel<typeof projectTable>
export type Note = InferSelectModel<typeof noteTable>
