import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { ollama } from "ollama-ai-provider";

export interface LLMChatConfig {
    production: boolean;
    localStreaming?: boolean;
}

export const createLLM = (_config: LLMChatConfig = { production: false, localStreaming: false }) => {
    if (_config.production == false) {
        console.log("Using Ollama.");
        return ollama("qwen3:4b", {
            simulateStreaming: !_config.localStreaming
        })
    }

    const openrouter = createOpenAICompatible({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env["OPENROUTER_API_KEY"]!,
        name: "openrouter"
    });

    return openrouter("google/gemini-2.0-flash-exp:free");
}
