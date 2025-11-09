'use server';

/**
 * @fileOverview AI-powered transaction categorization flow.
 *
 * categorizeTransaction - A function that categorizes a transaction based on its data.
 * CategorizeTransactionInput - The input type for the categorizeTransaction function.
 * CategorizeTransactionOutput - The return type for the categorizeTransaction function.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// List of models to try in order of preference
const GEMINI_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
];

const CategorizeTransactionInputSchema = z.object({
  merchantName: z.string().describe('The name of the merchant or vendor.'),
  amount: z.number().describe('The transaction amount.'),
  description: z.string().describe('A description of the transaction.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  category: z.enum([
    'income',
    'expenses',
    'sales',
    'services',
    'gig_work',
    'remittances',
    'inventory',
    'rent',
    'utilities',
    'transport',
    'food',
    'supplies',
  ]).describe('The predicted category of the transaction.'),
  subcategory: z.string().describe('A more specific subcategory of the transaction.'),
  confidenceLevel: z.number().describe('A confidence score (0-1) for the categorization.'),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

function buildPrompt(input: CategorizeTransactionInput): string {
  return `You are a personal finance assistant that specializes in categorizing transactions.

Given the following transaction information, determine the most appropriate category and subcategory.
Also assign a confidence level (0-1) for your categorization.

Merchant Name: ${input.merchantName}
Amount: ${input.amount}
Description: ${input.description}

Return JSON in this exact format:
{
  "category": "one of: income, expenses, sales, services, gig_work, remittances, inventory, rent, utilities, transport, food, supplies",
  "subcategory": "specific subcategory",
  "confidenceLevel": number between 0 and 1
}`;
}

async function categorizeWithFallback(
  genAI: GoogleGenerativeAI,
  input: CategorizeTransactionInput
): Promise<string> {
  let lastError: Error | null = null;
  const prompt = buildPrompt(input);

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Categorize Transaction] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.5,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 512,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      console.log(`[Categorize Transaction] Success with model: ${modelName}`);
      return response;
    } catch (error: any) {
      console.log(`[Categorize Transaction] Model ${modelName} failed:`, error.message);
      lastError = error;
    }
  }

  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`
  );
}

export async function categorizeTransaction(input: CategorizeTransactionInput): Promise<CategorizeTransactionOutput> {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GOOGLE_GENAI_API_KEY is not configured');
    }

    console.log('[Categorize Transaction] Initializing Google AI...');
    const genAI = new GoogleGenerativeAI(apiKey);

    const response = await categorizeWithFallback(genAI, input);
    const output = JSON.parse(response) as CategorizeTransactionOutput;
    
    // Validate the output
    const validated = CategorizeTransactionOutputSchema.parse(output);
    return validated;
  } catch (error) {
    console.error('[Categorize Transaction] Error:', error);
    throw error;
  }
}