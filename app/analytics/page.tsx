"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Users,
  Receipt,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/expensi/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { formatCurrency } from "@/lib/utils";
import { CATEGORIES } from "@/types";

const COLORS = ["#1D9C5A", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#6B7280"];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { expenses, friends, groups } = useExpenses();
  const [dateRange, setDateRange] = useState("month");

  // Filter expenses based on date range
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const ranges: Record<string, number> = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
    };
    const days = ranges[dateRange] || 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return expenses.filter((e) => new Date(e.date) >= cutoff);
  }, [expenses, dateRange]);

  // Spending over time data
  const spendingOverTime = useMemo(() => {
    const data: Record<string, number> = {};
    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      data[date] = (data[date] || 0) + expense.amount;
    });
    return Object.entries(data)
      .map(([date, amount]) => ({ date, amount }))
      .slice(-10);
  }, [filteredExpenses]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    filteredExpenses.forEach((expense) => {
      data[expense.category] = (data[expense.category] || 0) + expense.amount;
    });
    return Object.entries(data).map(([name, value]) => ({
      name,
      value,
      color: CATEGORIES.find((c) => c.name === name)?.color || "#6B7280",
    }));
  }, [filteredExpenses]);

  // Spending by friend
  const friendSpending = useMemo(() => {
    const data: Record<string, number> = {};
    filteredExpenses.forEach((expense) => {
      expense.splits.forEach((split) => {
        if (split.userId !== user?.id) {
          const friend = friends.find((f) => f.friendId === split.userId);
          const name = friend?.friend.name || "Unknown";
          data[name] = (data[name] || 0) + split.amount;
        }
      });
    });
    return Object.entries(data)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredExpenses, friends, user]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const count = filteredExpenses.length;
    const avg = count > 0 ? total / count : 0;
    const highest = count > 0 ? Math.max(...filteredExpenses.map((e) => e.amount)) : 0;
    return { total, count, avg, highest };
  }, [filteredExpenses]);

  // Export data
  const exportData = () => {
    const data = {
      expenses: filteredExpenses,
      exportDate: new Date().toISOString(),
      dateRange,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expensi-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Track your spending patterns and insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 3 months</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(stats.total, user?.defaultCurrency || "USD")}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#1D9C5A]/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#1D9C5A]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Expenses</p>
                    <p className="text-2xl font-bold">{stats.count}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(stats.avg, user?.defaultCurrency || "USD")}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Highest</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(stats.highest, user?.defaultCurrency || "USD")}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="trend" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trend">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trend
            </TabsTrigger>
            <TabsTrigger value="categories">
              <PieChartIcon className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="friends">
              <Users className="w-4 h-4 mr-2" />
              By Friend
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value), user?.defaultCurrency || "USD")
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#1D9C5A"
                        strokeWidth={2}
                        dot={{ fill: "#1D9C5A" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${((percent || 0) * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value), user?.defaultCurrency || "USD")
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="friends">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Friend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={friendSpending}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          formatCurrency(Number(value), user?.defaultCurrency || "USD")
                        }
                      />
                      <Bar dataKey="amount" fill="#1D9C5A" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryData.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <div className="w-10 h-10 rounded-full bg-[#1D9C5A]/10 flex items-center justify-center shrink-0">
                  <PieChartIcon className="w-5 h-5 text-[#1D9C5A]" />
                </div>
                <div>
                  <p className="font-medium">Top Spending Category</p>
                  <p className="text-sm text-muted-foreground">
                    You spend the most on{" "}
                    <span className="font-medium text-foreground">
                      {categoryData[0]?.name}
                    </span>{" "}
                    ({formatCurrency(categoryData[0]?.value || 0, user?.defaultCurrency || "USD")})
                  </p>
                </div>
              </div>
            )}
            {friendSpending.length > 0 && (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Most Expensive Friendship</p>
                  <p className="text-sm text-muted-foreground">
                    You spend the most with{" "}
                    <span className="font-medium text-foreground">
                      {friendSpending[0]?.name}
                    </span>{" "}
                    ({formatCurrency(friendSpending[0]?.amount || 0, user?.defaultCurrency || "USD")})
                  </p>
                </div>
              </div>
            )}
            {stats.count > 0 && (
              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Spending Frequency</p>
                  <p className="text-sm text-muted-foreground">
                    You've recorded{" "}
                    <span className="font-medium text-foreground">{stats.count} expenses</span>{" "}
                    in this period, averaging{" "}
                    <span className="font-medium text-foreground">
                      {formatCurrency(stats.avg, user?.defaultCurrency || "USD")}
                    </span>{" "}
                    per expense
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
