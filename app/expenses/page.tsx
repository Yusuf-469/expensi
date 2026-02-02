"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Receipt,
  Calendar,
  Tag,
  Users,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppLayout } from "@/components/expensi/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  getInitials,
} from "@/lib/utils";
import { CATEGORIES, Category } from "@/types";

export default function ExpensesPage() {
  const { user } = useAuth();
  const { expenses, friends, groups } = useExpenses();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );
  const [selectedFriend, setSelectedFriend] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(query) ||
          e.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Friend filter
    if (selectedFriend !== "all") {
      result = result.filter(
        (e) =>
          e.paidBy === selectedFriend ||
          e.splits.some((s) => s.userId === selectedFriend)
      );
    }

    // Group filter
    if (selectedGroup !== "all") {
      result = result.filter((e) => e.groupId === selectedGroup);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return sortOrder === "desc"
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
    });

    return result;
  }, [
    expenses,
    searchQuery,
    selectedCategory,
    selectedFriend,
    selectedGroup,
    sortBy,
    sortOrder,
  ]);

  // Get selected expense details
  const expenseDetails = selectedExpense
    ? expenses.find((e) => e.id === selectedExpense)
    : null;

  // Get category color
  const getCategoryColor = (category: string) => {
    return CATEGORIES.find((c) => c.name === category)?.color || "#6B7280";
  };

  // Get user name
  const getUserName = (userId: string) => {
    if (userId === user?.id) return "You";
    const friend = friends.find((f) => f.friendId === userId);
    return friend?.friend.name || "Unknown";
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedFriend("all");
    setSelectedGroup("all");
  };

  const hasFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    selectedFriend !== "all" ||
    selectedGroup !== "all";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">
              {filteredExpenses.length} expense
              {filteredExpenses.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={(v) =>
                    setSelectedCategory(v as Category | "all")
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <Tag className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedFriend}
                  onValueChange={setSelectedFriend}
                >
                  <SelectTrigger className="w-[140px]">
                    <Users className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Friend" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Friends</SelectItem>
                    {friends.map((friend) => (
                      <SelectItem key={friend.friendId} value={friend.friendId}>
                        {friend.friend.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No expenses found</h3>
                <p className="text-muted-foreground mb-4">
                  {hasFilters
                    ? "Try adjusting your filters"
                    : "Add your first expense to get started"}
                </p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredExpenses.map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="cursor-pointer"
                onClick={() => setSelectedExpense(expense.id)}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                        style={{
                          backgroundColor: getCategoryColor(expense.category),
                        }}
                      >
                        {expense.category[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">
                            {expense.description}
                          </h3>
                          {expense.groupId && (
                            <Badge variant="secondary" className="text-xs">
                              {
                                groups.find((g) => g.id === expense.groupId)
                                  ?.name
                              }
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatRelativeDate(expense.date)}
                          <span>·</span>
                          <span>{expense.category}</span>
                          <span>·</span>
                          <span>Paid by {getUserName(expense.paidBy)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {formatCurrency(expense.amount, expense.currency)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {expense.splits.length} people
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Expense Detail Dialog */}
      <Dialog
        open={!!selectedExpense}
        onOpenChange={() => setSelectedExpense(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          {expenseDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{
                      backgroundColor: getCategoryColor(
                        expenseDetails.category
                      ),
                    }}
                  >
                    {expenseDetails.category[0]}
                  </div>
                  {expenseDetails.description}
                </DialogTitle>
                <DialogDescription>
                  {formatDate(expenseDetails.date)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        expenseDetails.amount,
                        expenseDetails.currency
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge
                      style={{
                        backgroundColor: getCategoryColor(
                          expenseDetails.category
                        ),
                      }}
                      className="text-white"
                    >
                      {expenseDetails.category}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Split Details</h4>
                  <div className="space-y-2">
                    {expenseDetails.splits.map((split) => (
                      <div
                        key={split.userId}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                              {getInitials(getUserName(split.userId))}
                            </AvatarFallback>
                          </Avatar>
                          <span>{getUserName(split.userId)}</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(
                            split.amount,
                            expenseDetails.currency
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {expenseDetails.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {expenseDetails.notes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
