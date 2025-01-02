import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env["DATABASE_URL"] as string);
export const db = drizzle({
    client: sql,
});

export { userTable, sessionTable, userMetadataTable } from "./schema";
export type { User, Session, UserMetadata } from "./schema";
