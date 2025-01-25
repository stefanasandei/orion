import { InferSelectModel } from "drizzle-orm";
import { integer, pgTableCreator, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `orion_${name}`);

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

    rememberMe: integer("remember_me").default(0).notNull(),

    name: varchar("name", { length: 64 })
        .notNull(),
    email: varchar("email", { length: 64 })
        .notNull(),
    passwordHash: varchar("password_hash", { length: 256 })
        .notNull(),
})

export const sessionTable = pgTable("session", {
    id: text("id").primaryKey(),
    userId: integer("user_id")
        .notNull()
        .references(() => userTable.id),

    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date"
    }).notNull()
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type UserMetadata = InferSelectModel<typeof userMetadataTable>
