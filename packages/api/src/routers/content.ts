import { db, noteTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context';
import { z } from 'zod';
import { desc, sql } from 'drizzle-orm';

// used as a query engine for content (documents / thoughts / tasks / etc)
export const contentRouter = createRouter({
    searchNotes: protectedProcedure
        .input(z.object({ query: z.string().min(1) }))
        .query(async ({ input, ctx }) => {
            // 1. build a natural language query
            const tsQuery = sql`websearch_to_tsquery('english', ${input.query.trim()})`;

            // 2. build the search vector (name has priority and then text content)
            const vectorQuery = sql`
                setweight(to_tsvector('english', regexp_replace(${noteTable.name}, '[-_.]', ' ', 'g')), 'A') ||
                setweight(to_tsvector('english', coalesce(${noteTable.textContent}, '')), 'B')`;

            const results = await db
                .select({
                    id: noteTable.id,
                    name: noteTable.name,
                    type: noteTable.type,
                    projectId: noteTable.projectId,
                    createdAt: noteTable.createdAt,

                    // 3. compute relevance rank from name and text content
                    rank: sql`ts_rank(
                        ${vectorQuery},
                        ${tsQuery}
                    )`
                })
                .from(noteTable)
                .where(
                    // search vector matches query AND restrict to current user
                    sql`${vectorQuery} @@ ${tsQuery} AND ${noteTable.userId} = ${ctx.session.userId}
                `)
                .orderBy((t) => desc(t.rank))
                .limit(20);

            return results;
        }),
});
