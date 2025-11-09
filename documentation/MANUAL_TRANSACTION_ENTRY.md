# Manual Transaction Entry Feature

## Overview

Added the ability for users to manually add transactions for cash payments and other transactions that aren't captured through document uploads. This feature maintains consistency with the existing design system and integrates seamlessly into the current workflow.

## Features

### 1. Add Transaction Dialog Component
- **Location**: `src/components/add-transaction-dialog.tsx`
- **Reusable component** that can be used anywhere in the app
- **Supports custom trigger** via children prop or uses default button

### 2. Form Fields

The manual transaction form includes:

- **Transaction Type**: Income or Expense (dropdown)
- **Merchant/Description**: Text input for the transaction source/destination
- **Amount**: Numeric input with decimal support (USD)
- **Category**: Dynamic dropdown based on transaction type
  - **Income Categories**: Sales, Services, Gig Work, Freelance, Remittances, Other Income
  - **Expense Categories**: Inventory, Rent, Utilities, Transport, Food, Supplies, Marketing, Equipment, Insurance, Other Expense
- **Date**: Date picker (defaults to today, cannot be future date)

### 3. Validation

- Merchant/Description is required
- Amount must be greater than 0
- Category must be selected
- Date cannot be in the future

### 4. Integration Points

#### Transactions Page
- **Location**: `/transactions`
- **Button placement**: Top right of the card header
- **Behavior**: Opens dialog to add transaction
- **Auto-refresh**: Transaction list updates automatically via Firestore real-time listeners

#### Documents Page
- **Location**: `/documents`
- **Button placement**: Below the camera scan button
- **Style**: Outlined button to differentiate from primary actions
- **Use case**: Quick entry for cash transactions while uploading documents

## Technical Implementation

### Client-Side Function
- **Function**: `createManualTransaction` in `src/lib/firebase/client-transactions.ts`
- **Uses**: Client Firebase SDK (not admin SDK) for direct client-side writes
- **Marks transactions** with `sourceDocumentId: 'manual'` to distinguish from AI-extracted transactions
- **Status**: All manual transactions are marked as `'cleared'` (not pending)

### Data Structure
```typescript
{
  id: string;
  merchant: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // YYYY-MM-DD format
  status: 'cleared';
  userId: string;
  sourceDocumentId: 'manual';
  createdAt: Date;
  updatedAt: Date;
}
```

### Real-time Updates
- Uses Firestore real-time listeners
- No manual refresh needed
- Transactions appear immediately after creation

## User Experience

### Workflow
1. User clicks "Add Transaction" button
2. Dialog opens with form
3. User selects transaction type (income/expense)
4. Category dropdown updates based on type
5. User fills in merchant, amount, and date
6. User clicks "Add Transaction"
7. Loading state shows during submission
8. Success toast notification appears
9. Dialog closes and form resets
10. Transaction appears in the list automatically

### Error Handling
- Form validation with helpful error messages
- Toast notifications for success/failure
- Disabled state during submission
- Graceful error recovery

## Design Consistency

### Follows Project Standards
- Uses Shadcn/ui components (Dialog, Input, Select, Button)
- Matches existing color scheme and typography
- Responsive design (mobile-first)
- Consistent spacing and padding
- Accessible form labels and ARIA attributes

### Visual Elements
- Primary button on transactions page
- Outlined button on documents page
- Plus icon for "add" action
- Loader icon during submission
- Toast notifications for feedback

## Future Enhancements

### Potential Improvements
1. **Bulk Entry**: Add multiple transactions at once
2. **Templates**: Save frequently used transactions as templates
3. **Recurring Transactions**: Set up automatic recurring entries
4. **Receipt Attachment**: Attach photos to manual transactions
5. **Edit/Delete**: Allow editing or deleting manual transactions
6. **Import CSV**: Bulk import from spreadsheets
7. **Notes Field**: Add optional notes/memo to transactions
8. **Tags**: Custom tags for better organization
9. **Duplicate Detection**: Warn about potential duplicate entries
10. **Quick Entry**: Keyboard shortcuts for faster data entry

## Testing Checklist

- [ ] Form validation works correctly
- [ ] Transaction type changes update category options
- [ ] Date picker prevents future dates
- [ ] Amount accepts decimal values
- [ ] Transaction appears in list after creation
- [ ] Toast notifications display correctly
- [ ] Dialog closes after successful submission
- [ ] Form resets after submission
- [ ] Works on mobile devices
- [ ] Works on tablets
- [ ] Works on desktop
- [ ] Accessible via keyboard navigation
- [ ] Screen reader compatible

## Usage Examples

### Basic Usage (Default Button)
```tsx
<AddTransactionDialog userId={user.uid} />
```

### Custom Trigger Button
```tsx
<AddTransactionDialog userId={user.uid}>
  <Button variant="outline">
    <Plus className="mr-2 h-4 w-4" />
    Custom Button Text
  </Button>
</AddTransactionDialog>
```

### With Callback
```tsx
<AddTransactionDialog 
  userId={user.uid}
  onTransactionAdded={() => {
    console.log('Transaction added!');
    // Custom logic here
  }}
/>
```

## Files Modified

1. **Created**: `src/components/add-transaction-dialog.tsx` - Reusable dialog component
2. **Created**: `src/lib/firebase/client-transactions.ts` - Client-side transaction creation
3. **Modified**: `src/app/(app)/transactions/page.tsx` - Added button in header
4. **Modified**: `src/app/(app)/documents/page.tsx` - Added button below camera scan

## Impact on Credit Scoring

Manual transactions are treated identically to AI-extracted transactions in the credit scoring algorithm:
- Counted in income consistency calculations
- Included in expense management analysis
- Contribute to transaction diversity score
- Affect financial growth metrics
- Used in bill payment history (if categorized appropriately)

The `sourceDocumentId: 'manual'` field allows for future analytics to distinguish between manual and automated entries if needed.
