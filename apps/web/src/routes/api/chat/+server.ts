import { createOllama } from 'ollama-ai-provider';
import type { RequestHandler } from './$types';
import { chatHandler } from "@repo/agent";

export const POST = (async ({ request }) => {
    const { messages } = await request.json();

    return chatHandler(messages);
}) satisfies RequestHandler;
