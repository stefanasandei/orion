import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { ollama } from "ollama-ai-provider";

const isProd = process.env["IS_PRODUCTION"] === "true";

const openrouter = createOpenAICompatible({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env["OPENROUTER_API_KEY"]!,
    name: "openrouter"
});

const local = () => {
    console.log("Using Ollama.");

    return ollama("qwen3:4b", {
        simulateStreaming: true
    })
}

// general chatting and small agentic tasks
export const generalModel = () => {
    if (!isProd) {
        return local();
    }

    // other models: deepseek/deepseek-chat-v3-0324, google/gemini-2.0-flash-001, openai/gpt-4.1-mini
    return openrouter("google/gemini-2.0-flash-001");
}

// large context, used for long summaries / accurate instruction following
export const largeModel = () => {
    if (!isProd) {
        return local();
    }

    // other models: deepseek/deepseek-r1:free
    return openrouter("openai/gpt-4.1-mini");
}
