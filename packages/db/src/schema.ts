import { InferSelectModel, relations, sql } from 'drizzle-orm';
import {
  integer,
  pgTableCreator,
  serial,
  boolean,
  text,
  timestamp,
  varchar,
  AnyPgColumn,
  primaryKey,
  pgEnum,
  index
} from 'drizzle-orm/pg-core';

const pgTable = pgTableCreator((name) => `orion_${name}`);

// Tables

export const userTable = pgTable('user', {
  id: serial('id').primaryKey(),
  githubId: integer('github_id').unique()
});

export const userMetadataTable = pgTable('user_metadata', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .$onUpdate(() => new Date()),

  rememberMe: boolean('remember_me').default(false).notNull(),
  emailVerified: boolean('email_verified').default(false),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  totpKey: varchar('totp_key', { length: 64 }),

  name: varchar('name', { length: 64 }).notNull(),
  email: varchar('email', { length: 64 }).notNull(),
  passwordHash: varchar('password_hash', { length: 256 }).notNull(),
  bio: text('bio').default('').notNull(),
  isPublic: boolean('is_public').default(false).notNull()
});

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull(),

  twoFactorVerified: boolean('two_factor_verified').default(false).notNull()
});

export const workspaceTable = pgTable('workspace', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .$onUpdate(() => new Date()),

  name: varchar('name', { length: 64 }),
  isFreePlan: boolean('is_free_plan').default(true).notNull()
});

export const tagTable = pgTable('tag', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  noteId: integer('note_id').references(() => noteTable.id, { onDelete: 'cascade' }),
  projectId: integer('project_id').references(() => projectTable.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 64 }).notNull(),
  color: varchar('color', {
    length: 64,
    enum: ['white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple']
  })
    .default('white')
    .notNull()
});

export const projectTable = pgTable('project', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  workspaceId: integer('workspace_id')
    .notNull()
    .references(() => workspaceTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .$onUpdate(() => new Date()),

  name: varchar('name', { length: 64 }).notNull(),
  description: text('description'),

  isPublic: boolean('is_public').default(false).notNull(),
});

// metadata for a project once it's public
export const projectPostTable = pgTable("project_post", {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .unique()
    .references(() => projectTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .$onUpdate(() => new Date()),

  likeCount: integer('like_count').default(0).notNull(),
});

export const commentTable = pgTable("comment", {
  id: serial("id").primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => projectPostTable.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .$onUpdate(() => new Date()),

  content: text("content").notNull()
})

export const noteEnum = pgEnum('type', ['document', 'thought', 'file', "task", "newsfeed"]);

export const noteTable = pgTable('note', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  projectId: integer('project_id').references(() => projectTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .$onUpdate(() => new Date())
    .defaultNow(),

  type: noteEnum().default('document').notNull(),

  name: text('name').notNull(),
  description: text('description'),

  jsonContent: text('json_content').notNull(), // for the rich text editor
  htmlContent: text('html_content').notNull(), // for previews
  textContent: text('text_content').notNull(), // for RAG, etc.

  parentNote: integer('parent_id').references((): AnyPgColumn => noteTable.id, { onDelete: 'cascade' })
},
  // used for searching
  // the name has more priority (A) than the content (B)
  (table) => [
    index('search_index').using(
      'gin',
      sql`(
          setweight(to_tsvector('english', ${table.name}), 'A') ||
          setweight(to_tsvector('english', ${table.textContent}), 'B')
      )`,
    ),
  ],
);

export const notesRelationshipTable = pgTable('notes_relationship', {
  parentId: integer('parent_id').notNull().references(() => noteTable.id, { onDelete: 'cascade' }),
  childId: integer('child_id').notNull().references(() => noteTable.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.parentId, table.childId] }),
]);


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
  post: one(projectPostTable, {
    fields: [projectTable.id],
    references: [projectPostTable.projectId]
  }),
  notes: many(noteTable),
  tags: many(tagTable),
}));

export const projectPostRelations = relations(projectPostTable, ({ many, one }) => ({
  project: one(projectTable, {
    fields: [projectPostTable.projectId],
    references: [projectTable.id]
  }),
  comments: many(commentTable)
}));

export const commentRelations = relations(commentTable, ({ one }) => ({
  post: one(projectPostTable, {  // Changed from project to post
    fields: [commentTable.postId],
    references: [projectPostTable.id]
  }),
  user: one(userTable, {
    fields: [commentTable.userId],
    references: [userTable.id]
  })
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
    relationName: 'note_parent'
  }),
  tags: many(tagTable)
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
export type UserMetadata = InferSelectModel<typeof userMetadataTable>;

export type Workspace = InferSelectModel<typeof workspaceTable>;
export type Tag = InferSelectModel<typeof tagTable>;
export type Project = InferSelectModel<typeof projectTable>;
export type Note = InferSelectModel<typeof noteTable>;
export type ProjectPost = InferSelectModel<typeof projectPostTable>;
export type Comment = InferSelectModel<typeof commentTable>;
