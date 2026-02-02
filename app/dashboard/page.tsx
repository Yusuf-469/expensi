"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Users,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/expensi/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { formatCurrency, formatRelativeDate, getInitials } from "@/lib/utils";
import { CATEGORIES } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const { balances, expenses, friends, activities, groups } = useExpenses();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Get recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5);

  // Get category color
  const getCategoryColor = (category: string) => {
    return CATEGORIES.find((c) => c.name === category)?.color || "#6B7280";
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    return CATEGORIES.find((c) => c.name === category)?.icon || "Circle";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AppLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your expenses
          </p>
        </motion.div>

        {/* Balance Cards */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 md:grid-cols-3"
        >
          <Card className="bg-gradient-to-br from-[#1D9C5A] to-[#157A46] text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/80">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(balances.netBalance, balances.currency)}
              </div>
              <p className="text-sm text-white/70 mt-1">
                {balances.netBalance >= 0
                  ? "Overall, you are owed money"
                  : "Overall, you owe money"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                You are owed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(balances.totalOwed, balances.currency)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                From {friends.filter((f) => balances.friendBalances[f.friendId] > 0).length} friends
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                You owe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(balances.totalOwe, balances.currency)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                To {friends.filter((f) => balances.friendBalances[f.friendId] < 0).length} friends
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="grid gap-4 md:grid-cols-4"
        >
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{expenses.length}</p>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{friends.length}</p>
                <p className="text-sm text-muted-foreground">Friends</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groups.length}</p>
                <p className="text-sm text-muted-foreground">Groups</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Button
                className="w-full h-full min-h-[80px] bg-[#1D9C5A] hover:bg-[#157A46]"
                onClick={() => setIsAddExpenseOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Expenses */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Expenses</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/expenses">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentExpenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No expenses yet</p>
                    <p className="text-sm">Add your first expense to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentExpenses.map((expense, index) => (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                        whileHover={{ x: 4 }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{
                            backgroundColor: getCategoryColor(expense.category),
                          }}
                        >
                          <span className="text-lg">
                            {expense.category[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {expense.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatRelativeDate(expense.date)} ·{" "}
                            {expense.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(expense.amount, expense.currency)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {expense.paidBy === user?.id
                              ? "You paid"
                              : "You owe"}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/activity">
                    View all
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">📋</span>
                    </div>
                    <p>No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                        whileHover={{ x: 4 }}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                            {getInitials(activity.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">
                              {activity.user.name}
                            </span>{" "}
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeDate(activity.createdAt)}
                          </p>
                        </div>
                        {activity.metadata?.amount && (
                          <Badge variant="secondary">
                            {formatCurrency(
                              activity.metadata.amount,
                              activity.metadata.currency || "USD"
                            )}
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
