/**
 * @fileOverview Helper functions for credit score calculation
 * Analyzes transaction data to calculate the 5 alternative credit factors
 */

import { Transaction } from '@/lib/types';

export interface CreditFactors {
  billPaymentHistory: number;
  incomeConsistency: number;
  expenseManagement: number;
  financialGrowth: number;
  transactionDiversity: number;
}

/**
 * Analyzes transactions to calculate credit scoring factors
 * Returns scores from 0-100 for each factor
 */
export function analyzeTransactionsForCreditScore(transactions: Transaction[]): CreditFactors {
  if (transactions.length === 0) {
    return {
      billPaymentHistory: 50,
      incomeConsistency: 50,
      expenseManagement: 50,
      financialGrowth: 50,
      transactionDiversity: 50,
    };
  }

  // Sort transactions by date
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 1. Bill Payment History (30%) - Focus on regular payments like rent, utilities, mobile
  const billPaymentHistory = calculateBillPaymentHistory(sortedTransactions);

  // 2. Income Consistency (25%) - Regularity of income
  const incomeConsistency = calculateIncomeConsistency(sortedTransactions);

  // 3. Expense Management (20%) - Spending discipline and savings
  const expenseManagement = calculateExpenseManagement(sortedTransactions);

  // 4. Financial Growth (15%) - Income trend over time
  const financialGrowth = calculateFinancialGrowth(sortedTransactions);

  // 5. Transaction Diversity (10%) - Variety of income sources
  const transactionDiversity = calculateTransactionDiversity(sortedTransactions);

  const factors: CreditFactors = {
    billPaymentHistory,
    incomeConsistency,
    expenseManagement,
    financialGrowth,
    transactionDiversity,
  };

  return factors;
}

/**
 * Calculate bill payment history score (0-100)
 * Looks for regular payments like rent, utilities, mobile bills
 */
function calculateBillPaymentHistory(transactions: Transaction[]): number {
  const billCategories = ['utilities', 'rent', 'phone', 'internet', 'subscription', 'bill', 'payment'];
  
  const billTransactions = transactions.filter(t => 
    t.type === 'expense' && 
    billCategories.some(cat => t.category?.toLowerCase().includes(cat))
  );

  // If no specific bill categories found, look at expense regularity instead
  if (billTransactions.length === 0) {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    if (expenseTransactions.length === 0) return 60; // Neutral score if no expenses
    
    // Check for regular expense patterns
    const monthlyExpenses = groupByMonth(expenseTransactions);
    const monthsWithExpenses = Object.keys(monthlyExpenses).length;
    
    // Score based on having regular expenses (indicates financial activity)
    if (monthsWithExpenses >= 3) return 75;
    if (monthsWithExpenses >= 2) return 65;
    return 60;
  }

  // Check for regularity - bills paid monthly
  const monthlyBills = groupByMonth(billTransactions);
  const monthsWithBills = Object.keys(monthlyBills).length;
  
  // More generous scoring for bill payment history
  if (monthsWithBills >= 6) return 95;
  if (monthsWithBills >= 4) return 85;
  if (monthsWithBills >= 3) return 75;
  if (monthsWithBills >= 2) return 65;
  return 55;
}

/**
 * Calculate income consistency score (0-100)
 * Measures regularity and stability of income
 */
function calculateIncomeConsistency(transactions: Transaction[]): number {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  if (incomeTransactions.length === 0) return 30;

  const monthlyIncome = groupByMonth(incomeTransactions);
  const monthlyTotals = Object.values(monthlyIncome).map(txns => 
    txns.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  );

  if (monthlyTotals.length === 0) return 30;
  if (monthlyTotals.length === 1) return 70; // Single month gets decent score

  // Calculate coefficient of variation (lower is better)
  const mean = monthlyTotals.reduce((a, b) => a + b, 0) / monthlyTotals.length;
  const variance = monthlyTotals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlyTotals.length;
  const stdDev = Math.sqrt(variance);
  const cv = mean > 0 ? stdDev / mean : 1;

  // Improved scoring - more generous for consistent high earners
  let score: number;
  if (cv <= 0.1) {
    // Very consistent income
    score = 100;
  } else if (cv <= 0.3) {
    // Good consistency
    score = 90 - (cv * 100);
  } else if (cv <= 0.5) {
    // Fair consistency
    score = 80 - (cv * 80);
  } else if (cv <= 1.0) {
    // Poor consistency
    score = 60 - (cv * 40);
  } else {
    // Very poor consistency
    score = Math.max(30, 40 - (cv * 20));
  }
  
  // Bonus for having income across multiple months
  const monthBonus = Math.min(20, monthlyTotals.length * 3);
  score = Math.min(100, score + monthBonus);
  
  // Ensure score is always between 0 and 100
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Calculate expense management score (0-100)
 * Measures spending discipline and savings behavior
 */
function calculateExpenseManagement(transactions: Transaction[]): number {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (income === 0) return 40;

  const expenseRatio = expenses / income;
  
  // Improved scoring for expense management
  let score: number;
  if (expenseRatio <= 0.1) {
    // Excellent: saving 90%+ (very high score)
    score = 100;
  } else if (expenseRatio <= 0.3) {
    // Very good: saving 70%+ 
    score = 95 - (expenseRatio * 50);
  } else if (expenseRatio <= 0.5) {
    // Good: saving 50%+
    score = 85 - (expenseRatio * 40);
  } else if (expenseRatio <= 0.7) {
    // Fair: saving 30%+
    score = 75 - (expenseRatio * 30);
  } else if (expenseRatio <= 0.9) {
    // Poor: saving 10%+
    score = 60 - ((expenseRatio - 0.7) * 100);
  } else {
    // Very poor: spending more than earning
    score = Math.max(20, 40 - ((expenseRatio - 0.9) * 100));
  }

  // Ensure score is always between 0 and 100
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Calculate financial growth score (0-100)
 * Measures income trend over time
 */
function calculateFinancialGrowth(transactions: Transaction[]): number {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  if (incomeTransactions.length < 2) return 50;

  const monthlyIncome = groupByMonth(incomeTransactions);
  const months = Object.keys(monthlyIncome).sort();
  
  if (months.length < 2) return 50;

  const firstMonthIncome = monthlyIncome[months[0]].reduce((sum, t) => sum + t.amount, 0);
  const lastMonthIncome = monthlyIncome[months[months.length - 1]].reduce((sum, t) => sum + t.amount, 0);

  if (firstMonthIncome === 0) return 50;

  const growthRate = (lastMonthIncome - firstMonthIncome) / firstMonthIncome;
  
  // Convert growth rate to score
  // Positive growth: 60-100, Stable: 40-60, Declining: 20-40
  let score: number;
  if (growthRate > 0.1) {
    score = 60 + (growthRate * 200);
  } else if (growthRate > -0.1) {
    score = 50 + (growthRate * 100);
  } else {
    score = 50 + (growthRate * 100);
  }

  // Ensure score is always between 0 and 100
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Calculate transaction diversity score (0-100)
 * Measures variety of income sources
 */
function calculateTransactionDiversity(transactions: Transaction[]): number {
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  
  if (incomeTransactions.length === 0) return 30;

  // Count unique categories and merchants
  const uniqueCategories = new Set(incomeTransactions.map(t => t.category).filter(Boolean));
  const uniqueMerchants = new Set(incomeTransactions.map(t => t.merchant).filter(Boolean));
  
  // More generous scoring for diversity
  let score = 50; // Base score
  
  // Category diversity bonus
  if (uniqueCategories.size >= 5) score += 25;
  else if (uniqueCategories.size >= 3) score += 20;
  else if (uniqueCategories.size >= 2) score += 15;
  else if (uniqueCategories.size >= 1) score += 10;
  
  // Merchant diversity bonus
  if (uniqueMerchants.size >= 10) score += 25;
  else if (uniqueMerchants.size >= 5) score += 20;
  else if (uniqueMerchants.size >= 3) score += 15;
  else if (uniqueMerchants.size >= 2) score += 10;
  else if (uniqueMerchants.size >= 1) score += 5;
  
  // Ensure score is always between 0 and 100
  return Math.round(Math.max(30, Math.min(100, score)));
}

/**
 * Helper: Group transactions by month
 */
function groupByMonth(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(transaction);
    
    return groups;
  }, {} as Record<string, Transaction[]>);
}
