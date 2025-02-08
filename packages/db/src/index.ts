import { drizzle } from 'drizzle-orm/neon-serverless';
import { config } from "dotenv";
import ws from 'ws';

config({ path: ".env" });

// the fetch-based connect does not support transactions
// const client = neon(process.env["DATABASE_URL"] as string);

// connect using websockets instead
export const db = drizzle({
    connection: process.env["DATABASE_URL"] as string,
    ws: ws,
});

export { userTable, sessionTable, userMetadataTable, workspaceTable, projectTable, noteTable, tagTable } from "./schema";
export type { User, Session, UserMetadata, Workspace, Project, Note, Tag } from "./schema";
