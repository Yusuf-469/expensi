"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Receipt,
  Settings,
  TrendingUp,
  PieChart,
  HandCoins,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppLayout } from "@/components/expensi/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { formatCurrency, getInitials } from "@/lib/utils";
import { CATEGORIES } from "@/types";
import { AddExpenseModal } from "@/components/expensi/modals/AddExpenseModal";
import { SettleUpModal } from "@/components/expensi/modals/SettleUpModal";
import { simplifyDebts, type PersonBalance } from "@/lib/debtSimplification";

export default function GroupDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { groups, expenses, friends, getGroupBalance } = useExpenses();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);

  const groupId = params.id as string;
  const group = groups.find((g) => g.id === groupId);
  const groupExpenses = expenses.filter((e) => e.groupId === groupId);

  if (!group) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Group not found</h2>
          <Link href="/groups">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Groups
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Calculate balances within this group
  const memberBalances = group.members.map((member) => {
    let paid = 0;
    let owes = 0;

    groupExpenses.forEach((expense) => {
      if (expense.paidBy === member.userId) {
        paid += expense.amount;
      }
      const split = expense.splits.find((s) => s.userId === member.userId);
      if (split) {
        owes += split.amount;
      }
    });

    return {
      ...member,
      paid,
      owes,
      net: paid - owes,
    };
  });

  // Calculate who owes whom using debt simplification algorithm
  const personBalances: PersonBalance[] = memberBalances.map((m) => ({
    userId: m.userId,
    name: m.user.name,
    balance: m.net,
  }));
  
  const simplifiedTransactions = simplifyDebts(personBalances);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  groupExpenses.forEach((expense) => {
    categoryTotals[expense.category] =
      (categoryTotals[expense.category] || 0) + expense.amount;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/groups">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <Badge variant="secondary">{group.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Created {new Date(group.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      groupExpenses.reduce((sum, e) => sum + e.amount, 0),
                      user?.defaultCurrency || "USD"
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#1D9C5A]/10 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-[#1D9C5A]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="text-2xl font-bold">{group.members.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-2xl font-bold">{groupExpenses.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="expenses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="expenses">
              <Receipt className="w-4 h-4 mr-2" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="balances">
              <HandCoins className="w-4 h-4 mr-2" />
              Balances
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <PieChart className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Group Expenses</h3>
              <Button
                onClick={() => setIsAddExpenseOpen(true)}
                className="bg-[#1D9C5A] hover:bg-[#157A46]"
              >
                Add Expense
              </Button>
            </div>

            {groupExpenses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No expenses yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first expense to this group
                  </p>
                  <Button
                    onClick={() => setIsAddExpenseOpen(true)}
                    className="bg-[#1D9C5A] hover:bg-[#157A46]"
                  >
                    Add Expense
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {groupExpenses.map((expense) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                            style={{
                              backgroundColor:
                                CATEGORIES.find(
                                  (c) => c.name === expense.category
                                )?.color || "#6B7280",
                            }}
                          >
                            {expense.category[0]}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString()} ·{" "}
                              {expense.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {formatCurrency(
                                expense.amount,
                                expense.currency
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Paid by{" "}
                              {expense.paidBy === user?.id
                                ? "you"
                                : group.members.find(
                                    (m) => m.userId === expense.paidBy
                                  )?.user.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="balances" className="space-y-4">
            <h3 className="text-lg font-semibold">Member Balances</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {memberBalances.map((member) => (
                <Card key={member.userId}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A]">
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {member.userId === user?.id
                            ? "You"
                            : member.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Paid {formatCurrency(member.paid, user?.defaultCurrency || "USD")} ·
                          Owes {formatCurrency(member.owes, user?.defaultCurrency || "USD")}
                        </p>
                      </div>
                      <div
                        className={`text-right ${
                          member.net >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        <p className="font-bold">
                          {member.net >= 0 ? "+" : ""}
                          {formatCurrency(member.net, user?.defaultCurrency || "USD")}
                        </p>
                        <p className="text-xs">
                          {member.net >= 0 ? "gets back" : "owes"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {simplifiedTransactions.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mt-6">Simplified Settlements</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimized payment plan to minimize transactions
                </p>
                <div className="space-y-2">
                  {simplifiedTransactions.map((transaction, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{transaction.fromName}</span>
                            <span className="text-muted-foreground">pays</span>
                            <span className="font-medium">{transaction.toName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1D9C5A]">
                              {formatCurrency(transaction.amount, user?.defaultCurrency || "USD")}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => setIsSettleUpOpen(true)}
                            >
                              Settle
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <h3 className="text-lg font-semibold">Spending by Category</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(categoryTotals).map(([category, amount]) => {
                const categoryInfo = CATEGORIES.find((c) => c.name === category);
                return (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: categoryInfo?.color || "#6B7280" }}
                        >
                          {category[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{category}</p>
                        </div>
                        <p className="font-bold">
                          {formatCurrency(amount, user?.defaultCurrency || "USD")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        groupId={groupId}
      />
      <SettleUpModal open={isSettleUpOpen} onOpenChange={setIsSettleUpOpen} />
    </AppLayout>
  );
}
