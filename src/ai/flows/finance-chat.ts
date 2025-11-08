"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const FinanceChatInputSchema = z.object({
  message: z.string().describe("User message to the finance advisor"),
  transactions: z
    .array(
      z.object({
        date: z.string(),
        merchant: z.string(),
        amount: z.number(),
        type: z.string(),
        category: z.string(),
        status: z.string(),
      })
    )
    .describe("User transaction history"),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .describe("Previous conversation messages"),
});

const FinanceChatOutputSchema = z.object({
  response: z.string().describe("AI assistant response"),
});

export type FinanceChatInput = z.infer<typeof FinanceChatInputSchema>;
export type FinanceChatOutput = z.infer<typeof FinanceChatOutputSchema>;

export async function chatWithFinanceAdvisor(
  input: FinanceChatInput
): Promise<FinanceChatOutput> {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_GENAI_API_KEY is not set");
      return { response: "Configuration error. Please contact support." };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Build transaction summary
    const transactionSummary =
      input.transactions.length > 0
        ? input.transactions
            .map(
              (t) =>
                `- Date: ${t.date}, Merchant: ${t.merchant}, Amount: ${t.amount}, Type: ${t.type}, Category: ${t.category}`
            )
            .join("\n")
        : "No transactions available yet.";

    // Build conversation history
    const conversationHistory = input.conversationHistory
      ? input.conversationHistory
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n")
      : "";

    const prompt = `You are a friendly and knowledgeable personal finance advisor. Your role is to help users understand their spending habits, provide budgeting advice, and offer financial tips based on their transaction history.

USER'S TRANSACTION DATA:
${transactionSummary}

${conversationHistory ? `CONVERSATION HISTORY:\n${conversationHistory}\n` : ""}

USER MESSAGE: ${input.message}

Guidelines:
- Be conversational, friendly, and supportive
- Provide specific insights based on their actual transaction data
- Offer actionable advice and tips
- If they ask about spending patterns, analyze their transactions
- Suggest budgeting strategies when relevant
- Be encouraging about good financial habits
- Keep responses concise but helpful (2-4 sentences usually)
- Use emojis occasionally to be friendly 😊
- If no transactions exist, encourage them to upload documents to get started

Respond to the user's message:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return { response };
  } catch (error) {
    console.error("chatWithFinanceAdvisor error:", error);
    return {
      response:
        "I apologize, but I encountered an error. Please try again later.",
    };
  }
}
