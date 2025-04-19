import { drizzle } from 'drizzle-orm/neon-serverless';
import { config } from "dotenv";
import ws from 'ws';

import * as schema from "./schema"

if (typeof process == typeof undefined) {
    console.error("This should NOT be imported from the client.");
    console.trace();
}

config({ path: ".env" });

// the fetch-based connect does not support transactions
// const client = neon(process.env["DATABASE_URL"] as string);

// connect using websockets instead
export const db = drizzle({
    connection: process.env["DATABASE_URL"] as string,
    ws: ws,
    schema: schema
});

export { userTable, sessionTable, userMetadataTable, workspaceTable, projectTable, noteTable, tagTable, projectPostTable, commentTable } from "./schema";
export type { User, Session, UserMetadata, Workspace, Project, Note, Tag, ProjectPost, Comment } from "./schema";
