import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOllama } from "@langchain/ollama";
import { ChatMistralAI } from "@langchain/mistralai";

export interface LLMChatConfig {
    production: boolean;
}

export class LLMChatFactory {
    static create(config: LLMChatConfig): BaseChatModel {
        if (config.production) {
            return new ChatMistralAI({
                model: "mistral-small-latest"
            });
        }
        return new ChatOllama({
            model: "llama3.2:3b"
        });
    }
}
