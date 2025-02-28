import { createOllama } from 'ollama-ai-provider';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';

const ollama = createOllama({});

// TODO: this is just for local testing
export const POST = (async ({ request }) => {
    const { messages } = await request.json();

    const result = streamText({
        model: ollama('smollm2:135m'),
        messages,
    });

    return result.toDataStreamResponse();
}) satisfies RequestHandler;
