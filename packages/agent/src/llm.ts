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
        // required for tool calls
        simulateStreaming: true
    })
}

// general chatting and small agentic tasks
export const generalModel = () => {
    if (!isProd) {
        return local();
    }

    // other models: deepseek/deepseek-chat-v3-0324
    return openrouter("mistralai/mistral-small-3.1-24b-instruct:free");
}

// large context, used for long summaries / accurate instruction following
export const largeModel = () => {
    if (!isProd) {
        return local();
    }

    // other models: deepseek/deepseek-r1:free
    return openrouter("google/gemini-2.0-flash-001");
}
