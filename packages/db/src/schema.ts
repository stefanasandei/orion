import { UIMessage } from 'ai';
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
  index,
  vector,
  json
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

export const usageTable = pgTable("usage", {
  id: serial("id").primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date'
  })
    .notNull()
    .defaultNow(),

  promptTokens: integer("prompt_tokens").default(0).notNull(),
  completionTokens: integer("completion_tokens").default(0).notNull(),

  fileSize: integer("file_size").default(0).notNull(),
})

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

  name: varchar('name', { length: 64 }).notNull(),
  color: varchar('color', {
    length: 64,
    enum: ['white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple']
  })
    .default('white')
    .notNull()
});

export const noteTagsTable = pgTable('note_tags', {
  noteId: integer('note_id')
    .notNull()
    .references(() => noteTable.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id')
    .notNull()
    .references(() => tagTable.id, { onDelete: 'cascade' })
}, (table) => ({
  pk: primaryKey({ columns: [table.noteId, table.tagId] })
}));

export const projectTagsTable = pgTable('project_tags', {
  projectId: integer('project_id')
    .notNull()
    .references(() => projectTable.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id')
    .notNull()
    .references(() => tagTable.id, { onDelete: 'cascade' })
}, (table) => ({
  pk: primaryKey({ columns: [table.projectId, table.tagId] })
}));

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

/*
  document - longer form content, written from the rich-text editor (content in .textContent)
  thought - quick note (content in .name)
  file - uploaded file (depending on projectId - null or not) (filename in .name, url in .textContent)
  task - todo task, (content in .name)
  newsfeed - general news for whole website (content in .name)
  memory - added by an ai agent, stuff to know about the user (content in .name)
*/
export const noteEnum = pgEnum('type', ['document', 'thought', 'file', "task", "newsfeed", "memory"]);

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

export const embeddingsTable = pgTable("embeddings", {
  id: serial('id').primaryKey(),
  noteId: integer('note_id')
    .notNull()
    .references(() => noteTable.id, { onDelete: 'cascade' }),

  content: text('content').notNull(),

  embedding: vector('embedding', { dimensions: 1536 }).notNull(),
},
  table => [
    index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
)

export const conversationTable = pgTable('conversation', {
  id: text('id').primaryKey(),
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
  messages: json("messages").$type<{ messages: UIMessage[] }>()
})

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
  usage: one(usageTable, {
    fields: [userTable.id],
    references: [usageTable.userId]
  }),
  workspaces: many(workspaceTable),
  tags: many(tagTable),
  projects: many(projectTable),
  notes: many(noteTable),
  conversations: many(conversationTable)
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
  tags: many(projectTagsTable)
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
  tags: many(noteTagsTable),
  embeddings: many(embeddingsTable)
}));

export const noteTagsRelations = relations(noteTagsTable, ({ one }) => ({
  note: one(noteTable, {
    fields: [noteTagsTable.noteId],
    references: [noteTable.id]
  }),
  tag: one(tagTable, {
    fields: [noteTagsTable.tagId],
    references: [tagTable.id]
  })
}));

export const projectTagsRelations = relations(projectTagsTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [projectTagsTable.projectId],
    references: [projectTable.id]
  }),
  tag: one(tagTable, {
    fields: [projectTagsTable.tagId],
    references: [tagTable.id]
  })
}));

export const tagRelations = relations(tagTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [tagTable.userId],
    references: [userTable.id]
  }),
  notes: many(noteTagsTable),
  projects: many(projectTagsTable)
}));

export const embeddingsRelations = relations(embeddingsTable, ({ one }) => ({
  note: one(noteTable, {
    fields: [embeddingsTable.noteId],
    references: [noteTable.id]
  }),
}));

// Types
export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type UserMetadata = InferSelectModel<typeof userMetadataTable>;
export type Usage = InferSelectModel<typeof usageTable>;

export type Workspace = InferSelectModel<typeof workspaceTable>;
export type Tag = InferSelectModel<typeof tagTable>;
export type Project = InferSelectModel<typeof projectTable>;
export type Note = InferSelectModel<typeof noteTable>;
export type ProjectPost = InferSelectModel<typeof projectPostTable>;
export type Comment = InferSelectModel<typeof commentTable>;
export type NoteTag = InferSelectModel<typeof noteTagsTable>;
export type ProjectTag = InferSelectModel<typeof projectTagsTable>;
export type Embedding = InferSelectModel<typeof embeddingsTable>;
