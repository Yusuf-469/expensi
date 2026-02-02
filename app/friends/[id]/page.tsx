"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Receipt,
  HandCoins,
  TrendingUp,
  Calendar,
  ArrowRightLeft,
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
import { formatCurrency, formatRelativeDate, getInitials } from "@/lib/utils";
import { CATEGORIES } from "@/types";
import { SettleUpModal } from "@/components/expensi/modals/SettleUpModal";

export default function FriendDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { friends, expenses, balances, getFriendExpenses } = useExpenses();
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);

  const friendId = params.id as string;
  const friend = friends.find((f) => f.friendId === friendId);
  const friendExpenses = getFriendExpenses(friendId);
  const balance = balances.friendBalances[friendId] || 0;

  if (!friend) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Friend not found</h2>
          <Link href="/friends">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Friends
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Calculate stats
  const totalExpenses = friendExpenses.length;
  const totalAmount = friendExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Get expenses where this friend is involved
  const sharedExpenses = friendExpenses.filter(
    (e) => e.paidBy === friendId || e.splits.some((s) => s.userId === friendId)
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/friends">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xl">
                {getInitials(friend.friend.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{friend.friend.name}</h1>
              <p className="text-muted-foreground">{friend.friend.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`text-2xl font-bold ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {balance >= 0 ? "+" : ""}
              {formatCurrency(Math.abs(balance), user?.defaultCurrency || "USD")}
            </p>
            <p className="text-sm text-muted-foreground">
              {balance >= 0 ? "owes you" : "you owe"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-[#1D9C5A] hover:bg-[#157A46]"
            onClick={() => setIsSettleUpOpen(true)}
          >
            <HandCoins className="w-4 h-4 mr-2" />
            Settle Up
          </Button>
          <Link href="/expenses" className="flex-1">
            <Button variant="outline" className="w-full">
              <Receipt className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Shared Expenses
                  </p>
                  <p className="text-2xl font-bold">{totalExpenses}</p>
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
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(totalAmount, user?.defaultCurrency || "USD")}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Friends Since</p>
                  <p className="text-2xl font-bold">
                    {new Date(friend.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">
              <Receipt className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="balances">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Balance Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            {sharedExpenses.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No expenses yet</h3>
                  <p className="text-muted-foreground">
                    You haven't shared any expenses with {friend.friend.name} yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {sharedExpenses.map((expense) => (
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
                              {formatRelativeDate(expense.date)} ·{" "}
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
                            <Badge
                              variant="outline"
                              className={
                                expense.paidBy === user?.id
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }
                            >
                              {expense.paidBy === user?.id
                                ? "You paid"
                                : `${friend.friend.name} paid`}
                            </Badge>
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
            <h3 className="text-lg font-semibold">Balance Breakdown</h3>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Total you've paid for {friend.friend.name}</span>
                  <span className="font-bold">
                    {formatCurrency(
                      sharedExpenses
                        .filter((e) => e.paidBy === user?.id)
                        .reduce((sum, e) => {
                          const friendSplit = e.splits.find(
                            (s) => s.userId === friendId
                          );
                          return sum + (friendSplit?.amount || 0);
                        }, 0),
                      user?.defaultCurrency || "USD"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span>Total {friend.friend.name} paid for you</span>
                  <span className="font-bold">
                    {formatCurrency(
                      sharedExpenses
                        .filter((e) => e.paidBy === friendId)
                        .reduce((sum, e) => {
                          const yourSplit = e.splits.find(
                            (s) => s.userId === user?.id
                          );
                          return sum + (yourSplit?.amount || 0);
                        }, 0),
                      user?.defaultCurrency || "USD"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#1D9C5A]/10 rounded-lg">
                  <span className="font-medium">Net Balance</span>
                  <span
                    className={`font-bold text-lg ${
                      balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {balance >= 0 ? "+" : ""}
                    {formatCurrency(
                      Math.abs(balance),
                      user?.defaultCurrency || "USD"
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <SettleUpModal open={isSettleUpOpen} onOpenChange={setIsSettleUpOpen} />
    </AppLayout>
  );
}
