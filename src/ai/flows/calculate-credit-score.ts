
'use server';

/**
 * @fileOverview Alternative Credit Score Calculation for Informal Economy Workers
 * 
 * IMPORTANT: This is NOT a FICO or traditional credit score!
 * 
 * This scoring model is specifically designed for individuals in the informal economy
 * who lack traditional credit products (credit cards, bank loans, mortgages).
 * 
 * Target Users:
 * - Gig workers and freelancers
 * - Street vendors and small merchants
 * - Cash-based economy workers
 * - Mobile wallet users
 * - Anyone without traditional banking history
 * 
 * Our Alternative Factors (0-1000 scale):
 * - Payment History (30%): Rent, utilities, mobile bills
 * - Income Consistency (25%): Regular earning patterns
 * - Expense Management (20%): Spending discipline & savings
 * - Financial Growth (15%): Income trends over time
 * - Transaction Diversity (10%): Multiple income sources
 * 
 * Functions:
 * - calculateCreditScore - Calculates alternative credit score and saves report
 * - CalculateCreditScoreInput - Input type with factor scores and transactions
 * - CalculateCreditScoreOutput - Output with score, grade, and breakdown
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { saveCreditReport } from '@/lib/firebase/firestore';
import { CreditReport } from '@/lib/types';
import { z } from 'zod';

const CalculateCreditScoreInputSchema = z.object({
  billPaymentHistory: z.number().min(0).max(100),
  incomeConsistency: z.number().min(0).max(100),
  expenseManagement: z.number().min(0).max(100),
  financialGrowth: z.number().min(0).max(100),
  transactionDiversity: z.number().min(0).max(100),
  transactions: z.array(z.any()).optional(),
});
export type CalculateCreditScoreInput = z.infer<typeof CalculateCreditScoreInputSchema>;

const CalculateCreditScoreOutputSchema = z.object({
  creditScore: z.number().min(0).max(1000),
  riskGrade: z.string(),
  scoreBreakdown: z.string(),
  recommendations: z.string(),
  scoreType: z.string().default('Alternative Credit Score'),
});
export type CalculateCreditScoreOutput = z.infer<typeof CalculateCreditScoreOutputSchema>;

function buildPrompt(input: CalculateCreditScoreInput): string {
  return `You are an AI credit analyst specializing in Alternative Credit Scoring for the informal economy.

  IMPORTANT: This is NOT a traditional FICO score. This is an Alternative Credit Score designed for:
  - Gig workers and freelancers
  - Street vendors and small merchants  
  - Cash-based economy workers
  - Mobile wallet users
  - Anyone without traditional credit cards or bank loans

  Traditional FICO scores don't work for these users because they require credit cards, loans, and banking history.
  Our alternative model evaluates financial behavior through different lenses.

  Scoring Factors (0-1000 scale):
  1. Bill Payment History (30%): Rent, utilities, mobile bills - on-time payment patterns
  2. Income Consistency (25%): Regular earning patterns, variance in monthly income
  3. Expense Management (20%): Spending discipline & savings behavior, financial discipline
  4. Financial Growth (15%): Income trend over 3-6 months, positive trajectory
  5. Transaction Diversity (10%): Variety of income sources, transaction types

  Algorithm:
  1. Take each factor score (0-100) provided in input
  2. Apply weighted average: (BPH*0.30) + (IC*0.25) + (EM*0.20) + (FG*0.15) + (TD*0.10)
  3. Scale result to 0-1000 range
  4. Assign risk grade:
     - A (800-1000): Excellent - Very low risk
     - B+ (700-799): Good - Low risk
     - B (600-699): Fair - Moderate risk
     - C (500-599): Needs improvement - Higher risk
     - D (<500): Poor - High risk

  Input Scores:
  Bill Payment History: ${input.billPaymentHistory} (Weight: 30%)
  Income Consistency: ${input.incomeConsistency} (Weight: 25%)
  Expense Management: ${input.expenseManagement} (Weight: 20%)
  Financial Growth: ${input.financialGrowth} (Weight: 15%)
  Transaction Diversity: ${input.transactionDiversity} (Weight: 10%)

  Tasks:
  1. Calculate the Alternative Credit Score (0-1000)
  2. Assign appropriate risk grade (A/B+/B/C/D)
  3. Provide detailed breakdown:
     - Show how each factor contributed (e.g., "Bill Payment: 85/100 * 30% = 25.5 points")
     - Show weighted sum and scaling to 0-1000
     - Explain what the score means for loan eligibility
  4. Provide 3-5 personalized recommendations:
     - Focus on lowest scoring factors
     - Give actionable steps (e.g., "Pay utility bills on time for 3 months")
     - Explain potential score improvement
  5. Include 'scoreType': 'Alternative Credit Score' in response

  Return data in JSON format with these exact fields:
  {
    "creditScore": number (0-1000),
    "riskGrade": string (A/B+/B/C/D),
    "scoreBreakdown": string (detailed explanation),
    "recommendations": string (actionable advice),
    "scoreType": "Alternative Credit Score"
  }
`;
}

// List of models to try in order of preference
const GEMINI_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
];

async function generateWithFallback(
  genAI: GoogleGenerativeAI,
  prompt: string
): Promise<string> {
  let lastError: Error | null = null;

  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`[Calculate Credit Score] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      console.log(`[Calculate Credit Score] Success with model: ${modelName}`);
      return response;
    } catch (error: any) {
      console.log(`[Calculate Credit Score] Model ${modelName} failed:`, error.message);
      lastError = error;
      // Continue to next model
    }
  }

  // If all models failed, throw the last error
  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}`
  );
}

export async function calculateCreditScore(
  input: CalculateCreditScoreInput,
  userId: string
): Promise<CalculateCreditScoreOutput> {
  try {
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GOOGLE_GENAI_API_KEY is not configured');
    }

    console.log('[Calculate Credit Score] Initializing Google AI...');
    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = buildPrompt(input);
    console.log('[Calculate Credit Score] Sending request to Gemini...');
    
    const response = await generateWithFallback(genAI, prompt);
    
    console.log('[Calculate Credit Score] Received response:', response.substring(0, 200));
    
    // Parse the JSON response
    const output = JSON.parse(response) as CalculateCreditScoreOutput;
    
    // Validate the output
    const validated = CalculateCreditScoreOutputSchema.parse(output);
    console.log('[Calculate Credit Score] Validated output:', validated);

    // Save the report to Firestore
    if (userId && validated) {
      console.log('[Calculate Credit Score] Saving report to Firestore...');
      const reportToSave: Omit<CreditReport, 'id'> = {
        generationDate: new Date().toISOString(),
        score: validated.creditScore,
        grade: validated.riskGrade as 'A' | 'B' | 'C' | 'D',
        url: '',
      };

      const factors = {
        billPaymentHistory: input.billPaymentHistory,
        incomeConsistency: input.incomeConsistency,
        expenseManagement: input.expenseManagement,
        financialGrowth: input.financialGrowth,
        transactionDiversity: input.transactionDiversity,
      };

      const periodStart = input.transactions?.[0]?.date || '';
      const periodEnd = input.transactions?.[input.transactions.length - 1]?.date || '';

      await saveCreditReport(
        userId,
        reportToSave,
        factors,
        input.transactions?.length || 0,
        periodStart,
        periodEnd
      );
      console.log('[Calculate Credit Score] Report saved successfully');
    }

    return validated;
  } catch (error) {
    console.error('[Calculate Credit Score] Error:', error);
    throw error;
  }
}
