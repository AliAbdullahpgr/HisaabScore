# Report Generation Debugging Guide

## Issues Fixed

### 1. Firebase Admin SDK Issue
**Problem**: `adminDb` was exported as a function but used as an object
**Fix**: Changed `src/lib/firebase/admin.ts` to export `adminDb` directly as a Firestore instance

### 2. Added Comprehensive Logging
**Location**: `src/app/api/generate-report/route.ts`
**Added logs at each step**:
- User ID received
- Transactions fetched
- Credit factors calculated
- AI flow called
- Result returned

## How to Debug

### Step 1: Check the Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Click "Generate New Report"
4. Look for any error messages

### Step 2: Check the Server Logs
1. Look at your terminal where `npm run dev` is running
2. You should see logs like:
   ```
   [Generate Report] Starting report generation for user: xxx
   [Generate Report] Fetching transactions...
   [Generate Report] Found transactions: X
   [Generate Report] Analyzing transactions...
   [Generate Report] Credit factors: {...}
   [Generate Report] Calling AI flow...
   [Generate Report] AI result: {...}
   ```

### Step 3: Verify Prerequisites

#### Check Transactions Exist
1. Go to `/transactions` page
2. Make sure you have at least one transaction
3. If not, either:
   - Upload a document on `/documents` page
   - Add a manual transaction using the "Add Transaction" button

#### Check Environment Variables
Make sure these are set in your `.env` file:
```env
GOOGLE_GENAI_API_KEY=your_key_here
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

#### Check Firebase Admin Credentials
Run this test to verify Firebase Admin is working:
```bash
# In your terminal
node -e "require('dotenv').config(); console.log('Project ID:', process.env.FIREBASE_PROJECT_ID); console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL); console.log('Private Key exists:', !!process.env.FIREBASE_PRIVATE_KEY);"
```

### Step 4: Common Error Messages

#### "No transactions found"
**Cause**: User has no transactions in Firestore
**Solution**: 
1. Upload a document on `/documents` page
2. Wait for it to be processed
3. Or add a manual transaction

#### "Internal server error"
**Cause**: Various issues (check server logs for details)
**Solutions**:
- Check Firebase Admin credentials
- Check Google AI API key
- Check Firestore security rules
- Check server logs for specific error

#### "Failed to generate report"
**Cause**: AI flow failed
**Solutions**:
- Check Google AI API key is valid
- Check API quota hasn't been exceeded
- Check network connectivity
- Look at server logs for AI-specific errors

### Step 5: Test the API Directly

You can test the API endpoint directly using curl:

```bash
curl -X POST http://localhost:9003/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{"userId":"YOUR_USER_ID_HERE"}'
```

Replace `YOUR_USER_ID_HERE` with your actual Firebase user ID.

### Step 6: Check Firestore Data

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check the structure:
   ```
   users/
     {userId}/
       transactions/
         {transactionId}/
           - merchant
           - amount
           - type
           - category
           - date
           - status
       creditReports/
         {reportId}/
           - score
           - grade
           - generationDate
   ```

## Expected Flow

1. User clicks "Generate New Report"
2. Frontend calls `/api/generate-report` with userId
3. API fetches transactions from Firestore
4. API analyzes transactions to calculate 5 credit factors
5. API calls AI flow with factors
6. AI calculates credit score (0-1000)
7. AI assigns risk grade (A/B/C/D)
8. API saves report to Firestore
9. Frontend shows success toast
10. Report appears in the table

## Testing Checklist

- [ ] Environment variables are set correctly
- [ ] Firebase Admin SDK is initialized
- [ ] User has at least one transaction
- [ ] Google AI API key is valid
- [ ] Server is running (`npm run dev`)
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] Firestore security rules allow reads/writes

## Quick Fix Commands

### Restart the development server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Reinstall dependencies
```bash
rm -rf node_modules
npm install
npm run dev
```

## Still Not Working?

If you've tried all the above and it's still not working:

1. **Check the exact error message** in server logs
2. **Copy the full error stack trace**
3. **Note which step fails** (fetching transactions, analyzing, AI call, saving)
4. **Check if other features work** (document upload, manual transactions)

## Success Indicators

When working correctly, you should see:
- ✅ "Report Generated! 🎉" toast notification
- ✅ New report appears in the table
- ✅ Report shows correct score and grade
- ✅ Can view and download the report
- ✅ No errors in console or server logs
