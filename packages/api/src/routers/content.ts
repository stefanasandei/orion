import { db, noteTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context';
import { z } from 'zod';
import { and, desc, eq, sql } from 'drizzle-orm';
import { ragHandler } from '@repo/agent';

// used as a query engine for content (documents / thoughts / tasks / etc)
export const contentRouter = createRouter({
    searchNotes: protectedProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input, ctx }) => {
            // guide: https://orm.drizzle.team/docs/guides/postgresql-full-text-search

            // create the word vectors on the fly
            const matchQuery = sql`(
                setweight(to_tsvector('english', ${noteTable.name}), 'A') ||
                setweight(to_tsvector('english', ${noteTable.textContent}), 'B')
                ), to_tsquery('english', ${input.query})`;

            const searchResult = await db
                .select({
                    id: noteTable.id,
                    name: noteTable.name,
                    type: noteTable.type,
                    createdAt: noteTable.createdAt,

                    // ts_rank -> the frequency of query terms throughout the document.
                    // ts_rank_cd -> the proximity of query terms within the document.
                    rank: sql`ts_rank(${matchQuery})`,
                    rankCd: sql`ts_rank_cd(${matchQuery})`,
                })
                .from(noteTable)
                .where(
                    and(
                        sql`(
                            setweight(to_tsvector('english', ${noteTable.name}), 'A') ||
                            setweight(to_tsvector('english', ${noteTable.textContent}), 'B')
                        ) @@ to_tsquery('english', ${input.query})`,
                        eq(noteTable.userId, ctx.session.userId)
                    ),
                )
                .orderBy((t) => desc(t.rank))
                .limit(10);

            return searchResult;
        }),

    askRag: protectedProcedure
        .input(z.object({ query: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const res = await (ctx.event as any).fetch('/api/chat/rag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', content: input.query }] })
            });
            return res.json();
        }),
});
