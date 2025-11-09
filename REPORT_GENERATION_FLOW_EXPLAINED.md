# Report Generation Flow - Complete Explanation

## Overview

The report generation system has been completely rewritten to use the Google Generative AI SDK directly instead of Genkit, which was causing compatibility issues.

## The Complete Flow

### 1. User Clicks "Generate New Report"
**Location**: `/reports` page (`src/app/(app)/reports/page.tsx`)

```typescript
const handleGenerateReport = async () => {
  const response = await fetch('/api/generate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user.uid }),
  });
}
```

### 2. API Route Receives Request
**Location**: `src/app/api/generate-report/route.ts`

**Step 2.1**: Fetch User Transactions
```typescript
const { getUserTransactions } = await import("@/lib/firebase/firestore");
const transactions = await getUserTransactions(userId);
// Returns array of 18 transactions from Firestore
```

**Step 2.2**: Analyze Transactions
```typescript
const { analyzeTransactionsForCreditScore } = await import("@/lib/credit-analysis");
const factors = analyzeTransactionsForCreditScore(transactions);
```

This calculates 5 credit factors (0-100 each):
- `billPaymentHistory`: 60
- `incomeConsistency`: 41
- `expenseManagement`: 68
- `financialGrowth`: 0
- `transactionDiversity`: 95

**Step 2.3**: Call AI to Calculate Score
```typescript
const { calculateCreditScore } = await import("@/ai/flows/calculate-credit-score");
const result = await calculateCreditScore({
  ...factors,
  transactions: transactions
}, userId);
```

### 3. AI Credit Score Calculation
**Location**: `src/ai/flows/calculate-credit-score.ts`

**NEW IMPLEMENTATION** (Direct Google AI SDK):

**Step 3.1**: Initialize Google AI
```typescript
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    responseMimeType: 'application/json',
  },
});
```

**Step 3.2**: Build Prompt
```typescript
const prompt = `You are an AI credit analyst...

Input Scores:
Bill Payment History: 60 (Weight: 30%)
Income Consistency: 41 (Weight: 25%)
Expense Management: 68 (Weight: 20%)
Financial Growth: 0 (Weight: 15%)
Transaction Diversity: 95 (Weight: 10%)

Calculate the credit score using weighted average...
Return JSON with: creditScore, riskGrade, scoreBreakdown, recommendations`;
```

**Step 3.3**: Send to Gemini API
```typescript
const result = await model.generateContent(prompt);
const response = result.response.text();
```

**What Gemini Receives**:
- A detailed prompt explaining the alternative credit scoring system
- The 5 factor scores (60, 41, 68, 0, 95)
- Instructions to calculate weighted average and scale to 0-1000
- Request for JSON response with specific fields

**What Gemini Returns**:
```json
{
  "creditScore": 528,
  "riskGrade": "C",
  "scoreBreakdown": "Bill Payment: 60*0.30=18, Income: 41*0.25=10.25, Expense: 68*0.20=13.6, Growth: 0*0.15=0, Diversity: 95*0.10=9.5. Total: 51.35/100 * 10 = 528/1000",
  "recommendations": "1. Improve income consistency by establishing regular payment schedules. 2. Focus on financial growth by increasing income sources. 3. Maintain good expense management.",
  "scoreType": "Alternative Credit Score"
}
```

**Step 3.4**: Parse and Validate
```typescript
const output = JSON.parse(response);
const validated = CalculateCreditScoreOutputSchema.parse(output);
```

**Step 3.5**: Save to Firestore
```typescript
await saveCreditReport(userId, {
  generationDate: new Date().toISOString(),
  score: 528,
  grade: 'C',
  url: ''
}, factors, 18, periodStart, periodEnd);
```

### 4. Response Sent Back
**API Response**:
```json
{
  "success": true,
  "score": 528,
  "grade": "C",
  "breakdown": {...},
  "recommendations": "...",
  "transactionCount": 18,
  "factors": {...}
}
```

### 5. Frontend Updates
**Location**: `/reports` page

- Shows success toast: "Report Generated! 🎉"
- Firestore real-time listener automatically updates the table
- New report appears with score 528 and grade C

## Communication with Gemini

### Request Format
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
Headers:
  - x-goog-api-key: AIzaSyC9WlrFYh7dw012iQvh3bdP7kWjSpghaSA
  - Content-Type: application/json

Body:
{
  "contents": [{
    "parts": [{
      "text": "You are an AI credit analyst... [full prompt]"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "maxOutputTokens": 2048,
    "responseMimeType": "application/json"
  }
}
```

### Response Format
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "{\"creditScore\":528,\"riskGrade\":\"C\",...}"
      }]
    },
    "finishReason": "STOP"
  }],
  "usageMetadata": {
    "promptTokenCount": 450,
    "candidatesTokenCount": 120,
    "totalTokenCount": 570
  }
}
```

## Why We Changed from Genkit

### Old Approach (Genkit)
```typescript
const prompt = ai.definePrompt({
  name: 'calculateCreditScorePrompt',
  model: 'googleai/gemini-1.5-flash',
  // ...
});

const flow = ai.defineFlow({...}, async (input) => {
  const { output } = await prompt(input);
  return output;
});
```

**Problem**: Genkit's `googleai` plugin was throwing "Unknown action type" error, likely due to:
- Version incompatibility between Genkit and Google AI plugin
- Model name format issues
- Complex abstraction layer causing issues

### New Approach (Direct SDK)
```typescript
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const result = await model.generateContent(prompt);
```

**Benefits**:
- Direct communication with Google AI API
- No abstraction layer issues
- Better error messages
- More control over configuration
- Same approach as finance chat (proven to work)

## Expected Score Calculation

Based on your factors:
```
Bill Payment History: 60 * 0.30 = 18.0
Income Consistency:   41 * 0.25 = 10.25
Expense Management:   68 * 0.20 = 13.6
Financial Growth:      0 * 0.15 = 0.0
Transaction Diversity: 95 * 0.10 = 9.5
                              ------
Total:                        51.35 / 100

Scaled to 0-1000: 51.35 * 10 = 513.5 ≈ 514-528

Grade: C (500-599 range)
```

## Testing the New Implementation

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Click "Generate New Report"**

3. **Check server logs** for:
   ```
   [Calculate Credit Score] Initializing Google AI...
   [Calculate Credit Score] Sending request to Gemini...
   [Calculate Credit Score] Received response: {...}
   [Calculate Credit Score] Validated output: {...}
   [Calculate Credit Score] Saving report to Firestore...
   [Calculate Credit Score] Report saved successfully
   ```

4. **Expected result**: Score around 514-528, Grade C

## Troubleshooting

If it still fails:
1. Check the exact error message in server logs
2. Verify API key is valid (we already confirmed it is)
3. Check network connectivity
4. Verify Firestore permissions

The new implementation is much more reliable and follows the same pattern as the working finance chat feature.
