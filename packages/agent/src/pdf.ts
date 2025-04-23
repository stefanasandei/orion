import { db, noteTable } from '@repo/db';
import { eq } from 'drizzle-orm';
// @ts-ignore
import pdfParse from 'pdf-parse-debugging-disabled';
import { generateObject } from 'ai';
import { createLLM } from './llm';
import { z } from 'zod';

export const generatePdfMetadata = async (fileUrl: string, noteId: number) => {
    // 1. fetch PDF as ArrayBuffer
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. parse PDF text
    let pdfText: string;
    try {
        const data = await pdfParse(buffer);
        pdfText = data.text;
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to parse PDF.');
    }

    // 3. generate summary + suggested questions using AI
    const result = await generateObject({
        // @ts-ignore Type mismatch between ai and @ai-sdk/provider versions
        model: createLLM(),
        schema: z.object({
            summary: z.string().describe("a concise summary of the document contents"),
            questions: z.array(z.string()).describe("suggested questions to encourage the user to learn more about the document")
        }),
        system: `You are an AI assistant that helps analyze PDF documents. Given the text content of a PDF, you will:
        1. Generate a concise summary (max 250 words)
        2. Generate 3-5 relevant questions that could be asked about the content`,
        prompt: pdfText
    });

    // 4. insert into the database
    await db.update(noteTable)
        .set({
            jsonContent: JSON.stringify({
                summary: result.object.summary,
                questions: result.object.questions
            })
        })
        .where(eq(noteTable.id, noteId));
}
