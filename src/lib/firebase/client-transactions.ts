import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

/**
 * Create a manual transaction from the client side
 * Uses the client Firebase SDK instead of admin SDK
 */
export async function createManualTransaction(
  userId: string,
  transactionData: {
    merchant: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
  }
): Promise<string> {
  const db = getFirestore();
  const transactionsRef = collection(db, 'users', userId, 'transactions');

  const docRef = await addDoc(transactionsRef, {
    merchant: transactionData.merchant,
    amount: transactionData.amount,
    type: transactionData.type,
    category: transactionData.category,
    date: transactionData.date,
    status: 'cleared',
    userId,
    sourceDocumentId: 'manual', // Mark as manually entered
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}
