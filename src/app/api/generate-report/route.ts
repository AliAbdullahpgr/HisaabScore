import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to prevent build-time execution
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    console.log('[Generate Report] Starting report generation for user:', userId);

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Step 1: Fetch user transactions
    console.log('[Generate Report] Fetching transactions...');
    const { getUserTransactions } = await import("@/lib/firebase/firestore");
    const transactions = await getUserTransactions(userId);
    console.log('[Generate Report] Found transactions:', transactions.length);

    if (transactions.length === 0) {
      return NextResponse.json(
        {
          message:
            "No transactions found. Please upload and process documents first.",
          transactionCount: 0,
        },
        { status: 400 }
      );
    }

    // Step 2: Analyze transactions to calculate credit factors
    console.log('[Generate Report] Analyzing transactions...');
    const { analyzeTransactionsForCreditScore } = await import(
      "@/lib/credit-analysis"
    );
    const factors = analyzeTransactionsForCreditScore(transactions);
    console.log('[Generate Report] Credit factors:', factors);

    // Step 3: Call AI flow to calculate credit score
    console.log('[Generate Report] Calling AI flow...');
    const { calculateCreditScore } = await import(
      "@/ai/flows/calculate-credit-score"
    );
    const result = await calculateCreditScore(
      {
        ...factors,
        transactions: transactions as any[], // Pass transactions for reference
      },
      userId
    );
    console.log('[Generate Report] AI result:', result);

    // Return the result
    return NextResponse.json({
      success: true,
      score: result.creditScore,
      grade: result.riskGrade,
      breakdown: result.scoreBreakdown,
      recommendations: result.recommendations,
      transactionCount: transactions.length,
      factors: factors,
    });
  } catch (error: any) {
    console.error('[Generate Report] Error:', error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
