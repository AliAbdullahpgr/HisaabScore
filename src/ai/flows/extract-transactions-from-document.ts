
'use server';
/**
 * @fileOverview An AI flow for extracting multiple transactions from a document.
 *
 * - extractTransactionsFromDocument - A function that extracts transaction data from a text blob.
 * - ExtractTransactionsFromDocumentInput - The input type for the function.
 * - ExtractTransactionsFromDocumentOutput - The return type for the function.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { saveTransactions, updateDocumentStatus } from '@/lib/firebase/firestore';

// List of models to try in order of preference
const GEMINI_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
];

const TransactionSchema = z.object({
  id: z.string().describe('A unique identifier for the transaction (e.g., a UUID).'),
  date: z.string().describe('The date of the transaction (e.g., YYYY-MM-DD).'),
  merchant: z.string().describe('The name of the client or merchant.'),
  amount: z.number().describe('The transaction amount. Negative for purchases/transfers out, positive for deposits/transfers in.'),
  type: z.enum(['income', 'expense']).describe('The type of transaction.'),
  category: z.string().describe('A suitable category for the transaction (e.g., Purchase, Deposit, Transfer, Gig Work, Utilities).'),
  status: z.enum(['cleared', 'pending']).default('cleared'),
});

const ExtractTransactionsFromDocumentInputSchema = z.object({
  document: z.string().describe("A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ExtractTransactionsFromDocumentInput = z.infer<typeof ExtractTransactionsFromDocumentInputSchema>;

const ExtractTransactionsFromDocumentOutputSchema = z.object({
  transactions: z.array(TransactionSchema),
});
export type ExtractTransactionsFromDocumentOutput = z.infer<typeof ExtractTransactionsFromDocumentOutputSchema>;

async function extractWithFallback(
  genAI: GoogleGenerativeAI,
  documentDataUri: string
): Promise<string> {
  let lastError: Error | null = null;

  const prompt = `You are an expert at extracting structured transaction data from documents.
  
Analyze the document image and extract all transactions. Do not include summary totals.
For each transaction, determine if it is 'income' or 'expense' based on the amount and description.
Assign a unique ID to each transaction.
'Purchase' types or negative amounts are 'expense'. 'Deposit' types or positive amounts are 'income'.
For 'Transfer' types, use the amount sign to determine if it is income or expense.

Return JSON in this exact format:
{
  "transactions": [
    {
      "id": "unique-id",
      "date": "YYYY-MM-DD",
      "merchant": "Merchant Name",
      "amount": number,
      "type": "income" or "expense",
      "category": "Category Name",
      "status": "cleared"
    }
  ]
}`;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Extract Transactions] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 4096,
          responseMimeType: 'application/json',
        },
      });

      // Parse the data URI
      const matches = documentDataUri.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        throw new Error('Invalid data URI format');
      }

      const mimeType = matches[1];
      const base64Data = matches[2];

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
      ]);

      const response = result.response.text();
      console.log(`[Extract Transactions] Success with model: ${modelName}`);
      return response;
    } catch (error: any) {
      console.log(`[Extract Transactions] Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`
  );
}

export async function extractTransactionsFromDocument(
  input: ExtractTransactionsFromDocumentInput,
  userId: string,
  documentId: string
): Promise<ExtractTransactionsFromDocumentOutput> {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!apiKey) {
      throw new Error('GOOGLE_GENAI_API_KEY is not configured');
    }

    console.log('[Extract Transactions] Initializing Google AI...');
    const genAI = new GoogleGenerativeAI(apiKey);

    const response = await extractWithFallback(genAI, input.document);
    const output = JSON.parse(response) as ExtractTransactionsFromDocumentOutput;

    // Validate the output
    const validated = ExtractTransactionsFromDocumentOutputSchema.parse(output);

    // Assign UUIDs if AI didn't provide them
    const transactionsWithIds = validated.transactions.map((t) => {
      const txId = t.id || crypto.randomUUID();
      return { ...t, id: txId };
    });

    // Save transactions to Firestore
    if (userId && transactionsWithIds.length > 0) {
      await saveTransactions(userId, transactionsWithIds, documentId);

      // Update document status
      await updateDocumentStatus(
        userId,
        documentId,
        'processed',
        transactionsWithIds.length
      );
    } else {
      // Still mark as processed even if no transactions found
      await updateDocumentStatus(
        userId,
        documentId,
        'processed',
        0
      );
    }

    return { transactions: transactionsWithIds };
  } catch (error) {
    // Update document with error status
    if (documentId && userId) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown AI processing error';
      await updateDocumentStatus(
        userId,
        documentId,
        'failed',
        0,
        errorMessage
      );
    }
    // Re-throw the error to be caught by the client
    throw error;
  }
}
