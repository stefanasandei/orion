import type { RequestHandler } from './$types';
import { ragHandler } from "@repo/agent";

export const POST = (async ({ request }) => {
    const { messages } = await request.json();

    // console.log(messages[messages.length - 1].content)

    return await ragHandler(messages[messages.length - 1].content)
}) satisfies RequestHandler;
