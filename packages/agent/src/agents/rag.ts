import { Document } from "@langchain/core/documents";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { VectorStore } from "@langchain/core/vectorstores";
import { Annotation } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";

import { RLM_RAG_PROMPT } from "../prompts/rag";

export const createRAGAgent = async (
    vectorStore: VectorStore,
    llm: BaseChatModel
) => {
    // state
    const InputStateAnnotation = Annotation.Root({
        question: Annotation<string>,
    });

    const StateAnnotation = Annotation.Root({
        question: Annotation<string>,
        context: Annotation<Document[]>,
        answer: Annotation<string>,
    });

    const promptTemplate = ChatPromptTemplate.fromTemplate(RLM_RAG_PROMPT);

    // retrieve & generate functions
    const retrieve = async (state: typeof InputStateAnnotation.State) => {
        const retrievedDocs = await vectorStore.similaritySearch(state.question, 1);
        return { context: retrievedDocs };
    };

    const generate = async (state: typeof StateAnnotation.State) => {
        const docsContent = state.context.map((doc) => doc.pageContent).join("\n");
        const messages = await promptTemplate.invoke({
            question: state.question,
            context: docsContent,
        });

        const response = await llm.invoke(messages);
        return { answer: response };
    };

    // build the graph
    const graph = new StateGraph(StateAnnotation)
        .addNode("retrieve", retrieve)
        .addNode("generate", generate)
        .addEdge("__start__", "retrieve")
        .addEdge("retrieve", "generate")
        .addEdge("generate", "__end__")
        .compile();

    return graph;
}