import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env["DATABASE_URL"] as string);
export const db = drizzle(sql);

export { userTable, sessionTable } from "./schema";
export type { User, Session } from "./schema";
