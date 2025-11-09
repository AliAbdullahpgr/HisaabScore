"use client";

import { useMemo, useState } from "react";
import "./dashboard.module.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScoreGauge } from "@/components/score-gauge";
import { Transaction } from "@/lib/types";
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Package,
  Loader2,
  Wallet,
  CreditCard,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Calendar,
  ShoppingBag,
  Receipt,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { collection, query, orderBy } from "firebase/firestore";
import {
  useFirestore,
  useUser,
  useCollection,
  useMemoFirebase,
} from "@/firebase";
import { analyzeTransactionsForCreditScore } from "@/lib/credit-analysis";
import { AnimatedCounter } from "@/components/animated-counter";
import { CustomChartTooltip } from "@/components/custom-chart-tooltip";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const COLORS = [
  "#0679FB",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
];

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");

  const transactionsQuery = useMemoFirebase(
    () =>
      user
        ? query(
            collection(firestore, "users", user.uid, "transactions"),
            orderBy("date", "desc")
          )
        : null,
    [firestore, user]
  );
  const { data: transactions, isLoading: transactionsLoading } =
    useCollection<Transaction>(transactionsQuery);

  // Calculate dashboard metrics
  const dashboardData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalIncome: 0,
        totalExpense: 0,
        netProfit: 0,
        creditScore: 0,
        pendingTransactions: 0,
        incomeVsExpenseData: [],
        topProducts: [],
        categoryData: [],
        recentTransactions: [],
        trendData: [],
        expenseBreakdown: [],
      };
    }

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netProfit = totalIncome - totalExpense;

    // Count pending transactions
    const pendingTransactions = transactions.filter(
      (t) => t.status === "pending"
    ).length;

    // Calculate credit score
    const creditFactors = analyzeTransactionsForCreditScore(transactions);

    const creditScore = Math.round(
      (creditFactors.billPaymentHistory * 0.3 +
        creditFactors.incomeConsistency * 0.25 +
        creditFactors.expenseManagement * 0.2 +
        creditFactors.financialGrowth * 0.15 +
        creditFactors.transactionDiversity * 0.1) *
        10
    );

    // Income vs Expense by month
    const monthlyData = transactions.reduce((acc: any, t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, income: 0, expense: 0 };
      }

      if (t.type === "income") {
        acc[monthKey].income += Math.abs(t.amount);
      } else {
        acc[monthKey].expense += Math.abs(t.amount);
      }

      return acc;
    }, {});

    const incomeVsExpenseData = Object.values(monthlyData)
      .sort((a: any, b: any) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    // Trend data for line chart
    const trendData = Object.values(monthlyData)
      .sort((a: any, b: any) => a.month.localeCompare(b.month))
      .slice(-12)
      .map((item: any) => ({
        month: new Date(item.month).toLocaleDateString("en-US", {
          month: "short",
        }),
        balance: item.income - item.expense,
      }));

    // Top selling products (by merchant for income)
    const productSales = transactions
      .filter((t) => t.type === "income")
      .reduce((acc: any, t) => {
        const merchant = t.merchant || "Unknown";
        if (!acc[merchant]) {
          acc[merchant] = { merchant, total: 0, count: 0 };
        }
        acc[merchant].total += Math.abs(t.amount);
        acc[merchant].count += 1;
        return acc;
      }, {});

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 5);

    // Category-wise breakdown
    const categoryTotals = transactions.reduce((acc: any, t) => {
      const category = t.category || "Uncategorized";
      const key = `${category}-${t.type}`;

      if (!acc[key]) {
        acc[key] = { name: category, value: 0, type: t.type };
      }
      acc[key].value += Math.abs(t.amount);

      return acc;
    }, {});

    const categoryData = Object.values(categoryTotals);

    // Expense breakdown for donut chart
    const expenseTotals = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc: any, t) => {
        const category = t.category || "Uncategorized";
        if (!acc[category]) {
          acc[category] = { name: category, value: 0 };
        }
        acc[category].value += Math.abs(t.amount);
        return acc;
      }, {});

    const expenseBreakdown = Object.values(expenseTotals)
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 6);

    // Recent transactions (top 5)
    const recentTransactions = [...transactions].slice(0, 5);

    return {
      totalIncome,
      totalExpense,
      netProfit,
      creditScore,
      pendingTransactions,
      incomeVsExpenseData,
      topProducts,
      categoryData,
      recentTransactions,
      trendData,
      expenseBreakdown,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  if (isUserLoading || transactionsLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const {
    totalIncome,
    totalExpense,
    netProfit,
    creditScore,
    pendingTransactions,
    incomeVsExpenseData,
    topProducts,
    categoryData,
    recentTransactions,
    trendData,
    expenseBreakdown,
  } = dashboardData;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your financial activity
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Total Income Card */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
              <DollarSign className="h-6 w-6 text-green-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors group-hover:text-white">
              <span className="text-xl">⋯</span>
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide group-hover:text-white/80 transition-colors duration-300">
              Total Income
            </p>
            <div className="text-3xl font-bold group-hover:text-white transition-colors duration-300">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1 group-hover:text-white/90 transition-colors duration-300">
              <TrendingUp className="h-3 w-3" />
              6% vs last 30 days
            </p>
          </CardContent>
        </Card>

        {/* Total Expense Card */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative hover:bg-gradient-to-br hover:from-red-500 hover:to-rose-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
              <Receipt className="h-6 w-6 text-red-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors group-hover:text-white">
              <span className="text-xl">⋯</span>
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide group-hover:text-white/80 transition-colors duration-300">
              Total Expense
            </p>
            <div className="text-3xl font-bold group-hover:text-white transition-colors duration-300">
              {formatCurrency(totalExpense)}
            </div>
            <p className="text-xs text-red-600 flex items-center gap-1 group-hover:text-white/90 transition-colors duration-300">
              <TrendingDown className="h-3 w-3" />
              2% vs last 30 days
            </p>
          </CardContent>
        </Card>

        {/* Total Savings / Net Profit Card */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative hover:bg-gradient-to-br hover:from-teal-500 hover:to-cyan-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
              <Wallet className="h-6 w-6 text-teal-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors group-hover:text-white">
              <span className="text-xl">⋯</span>
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide group-hover:text-white/80 transition-colors duration-300">
              Total Savings
            </p>
            <div
              className={`text-3xl font-bold group-hover:text-white transition-colors duration-300 ${
                netProfit >= 0 ? "text-foreground" : "text-red-600"
              }`}
            >
              {formatCurrency(netProfit)}
            </div>
            <p
              className={`text-xs flex items-center gap-1 group-hover:text-white/90 transition-colors duration-300 ${
                netProfit >= 0 ? "text-red-600" : "text-teal-600"
              }`}
            >
              {netProfit >= 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <TrendingUp className="h-3 w-3" />
              )}
              1% vs last 30 days
            </p>
          </CardContent>
        </Card>

        {/* Credit Score Card */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
              <CreditCard className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors group-hover:text-white">
              <span className="text-xl">⋯</span>
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide group-hover:text-white/80 transition-colors duration-300">
              Credit Score
            </p>
            <div className="text-3xl font-bold text-blue-600 group-hover:text-white transition-colors duration-300">
              {creditScore}
            </div>
            <p className="text-xs text-blue-600 flex items-center gap-1 group-hover:text-white/90 transition-colors duration-300">
              <Activity className="h-3 w-3" />
              Alternative score
            </p>
          </CardContent>
        </Card>

        {/* Pending Transactions Card */}
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative hover:bg-gradient-to-br hover:from-orange-500 hover:to-orange-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/20">
              <Clock className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors group-hover:text-white">
              <span className="text-xl">⋯</span>
            </button>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide group-hover:text-white/80 transition-colors duration-300">
              Pending
            </p>
            <div className="text-3xl font-bold text-orange-600 group-hover:text-white transition-colors duration-300">
              {pendingTransactions}
            </div>
            <p className="text-xs text-orange-600 flex items-center gap-1 group-hover:text-white/90 transition-colors duration-300">
              <Activity className="h-3 w-3" />
              Pending transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Score & Monthly Overview Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Credit Score Gauge */}
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Credit Score Analysis
            </CardTitle>
            <CardDescription>
              Updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <ScoreGauge value={creditScore} />
          </CardContent>
          <div className="px-6 pb-4 text-xs text-muted-foreground text-center">
            Designed for workers without traditional credit.
          </div>
        </Card>

        {/* Monthly Cash Flow Chart */}
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Monthly Cash Flow
            </CardTitle>
            <CardDescription>Income vs Expenses trend</CardDescription>
          </CardHeader>
          <CardContent>
            {incomeVsExpenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incomeVsExpenseData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 4 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ fill: "#ef4444", r: 4 }}
                    name="Expense"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 - Income vs Expense & Balance Trend */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Income vs Expense Chart */}
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Income vs Expense
            </CardTitle>
            <CardDescription>
              Monthly comparison (Last 6 months)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {incomeVsExpenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeVsExpenseData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    fill="#10b981"
                    name="Income"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#ef4444"
                    name="Expense"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balance Trend Line Chart */}
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Balance Trend
            </CardTitle>
            <CardDescription>Net balance over time</CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0679FB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0679FB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#0679FB"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - Category Breakdown & Expense Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Pie Chart */}
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Category Breakdown
            </CardTitle>
            <CardDescription>Expenses and income by category</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Distribution Donut Chart */}
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Expense Distribution
            </CardTitle>
            <CardDescription>Top expense categories</CardDescription>
          </CardHeader>
          <CardContent>
            {expenseBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) =>
                      `${entry.name}: ${(
                        (entry.value /
                          expenseBreakdown.reduce(
                            (sum: number, item: any) => sum + item.value,
                            0
                          )) *
                        100
                      ).toFixed(0)}%`
                    }
                  >
                    {expenseBreakdown.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No expense data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Recent Transactions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Selling Products */}
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Top Income Sources
            </CardTitle>
            <CardDescription>Top 5 revenue generating sources</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {product.merchant}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.count} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      {formatCurrency(product.total)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No income data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription>Recent 5 transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-muted/50 transition-colors duration-200"
                    >
                      <TableCell className="text-xs">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {transaction.merchant}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : "secondary"
                          }
                          className={`${
                            transaction.type === "income"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          } transition-colors duration-200`}
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="text-center">
                  <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No transactions yet.</p>
                  <p className="text-xs mt-1">
                    Upload documents to get started.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View All Link */}
      {recentTransactions.length > 0 && (
        <div className="flex justify-center">
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-all duration-200 hover:gap-3"
          >
            View all transactions
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
