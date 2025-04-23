import type { RequestHandler } from './$types';
import { ragHandler } from "@repo/agent";

export const POST = (async ({ request, params }) => {
    const { messages } = await request.json();
    const noteId = parseInt(params.noteId);

    return await ragHandler(messages, noteId)
}) satisfies RequestHandler;
