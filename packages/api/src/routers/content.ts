import { db, noteTable } from '@repo/db';
import { createRouter, protectedProcedure } from '../context';
import { z } from 'zod';
import { and, desc, eq, sql } from 'drizzle-orm';

// used as a query engine for content (documents / thoughts / tasks / etc)
export const contentRouter = createRouter({

    // todo: refactor (clean bugs + cleaner)
    searchNotes: protectedProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input, ctx }) => {
            // Prepare search terms: split words and join with '&' for AND operation
            const searchTerms = input.query
                .trim()
                .split(/\s+/)
                .filter(term => term.length > 0)
                .map(term => term + ':*')  // Add prefix matching
                .join(' & ');

            if (!searchTerms) {
                return [];
            }

            // create the word vectors and match against the search query
            const searchResult = await db
                .select({
                    id: noteTable.id,
                    createdAt: noteTable.createdAt,

                    name: noteTable.name,
                    type: noteTable.type,
                    projectId: noteTable.projectId,

                    rank: sql`ts_rank(
                        setweight(to_tsvector('english', ${noteTable.name}), 'A') ||
                        setweight(to_tsvector('english', ${noteTable.textContent}), 'B'),
                        to_tsquery('english', ${searchTerms})
                    )`
                })
                .from(noteTable)
                .where(
                    and(
                        sql`(
                            setweight(to_tsvector('english', ${noteTable.name}), 'A') ||
                            setweight(to_tsvector('english', ${noteTable.textContent}), 'B')
                        ) @@ to_tsquery('english', ${searchTerms})`,
                        eq(noteTable.userId, ctx.session.userId)
                    )
                )
                .orderBy((t) => desc(t.rank))
                .limit(10);

            return searchResult;
        }),
});
