import { createOllama } from 'ollama-ai-provider';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';
import { testAgent } from "@repo/agent";

const ollama = createOllama({});

// TODO: this is just for local testing
export const POST = (async ({ request }) => {
    const { messages } = await request.json();

    console.log(testAgent());

    const result = streamText({
        model: ollama('llama3.2:3b'),
        messages,
    });

    return result.toDataStreamResponse();
}) satisfies RequestHandler;
