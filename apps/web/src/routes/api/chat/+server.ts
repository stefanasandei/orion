import type { RequestHandler } from './$types';
import { chatHandler, ragHandler } from "@repo/agent";

export const POST = (async ({ request }) => {
    const { messages } = await request.json();

    // return chatHandler(messages);
    return ragHandler(messages);
}) satisfies RequestHandler;
