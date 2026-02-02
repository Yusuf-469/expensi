"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import {
  CATEGORIES,
  CURRENCIES,
  Category,
  CurrencyCode,
  SplitMethod,
  SplitMember,
} from "@/types";
import { getInitials, formatCurrency, generateId } from "@/lib/utils";
import {
  Receipt,
  Users,
  Divide,
  Calculator,
  Percent,
  Scale,
} from "lucide-react";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId?: string;
}

export function AddExpenseModal({
  open,
  onOpenChange,
  groupId,
}: AddExpenseModalProps) {
  const { user } = useAuth();
  const { addExpense, friends, groups } = useExpenses();
  const [step, setStep] = useState(1);

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(
    user?.defaultCurrency || "USD"
  );
  const [category, setCategory] = useState<Category>("Food");
  const [paidBy, setPaidBy] = useState(user?.id || "");
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState("");

  // Split amounts for exact/percentage/shares
  const [splitAmounts, setSplitAmounts] = useState<Record<string, number>>({});

  const resetForm = () => {
    setStep(1);
    setDescription("");
    setAmount("");
    setCurrency(user?.defaultCurrency || "USD");
    setCategory("Food");
    setPaidBy(user?.id || "");
    setSplitMethod("equal");
    setSelectedFriends([]);
    setIsRecurring(false);
    setNotes("");
    setSplitAmounts({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const calculateSplits = (): SplitMember[] => {
    const num = parseFloat(amount) || 0;
    const allParticipants = [user?.id || "", ...selectedFriends];

    switch (splitMethod) {
      case "equal":
        const equalAmount = num / allParticipants.length;
        return allParticipants.map((id) => ({
          userId: id,
          amount: parseFloat(equalAmount.toFixed(2)),
        }));

      case "exact":
        return allParticipants.map((id) => ({
          userId: id,
          amount: splitAmounts[id] || 0,
        }));

      case "percentage":
        return allParticipants.map((id) => ({
          userId: id,
          amount: parseFloat(((num * (splitAmounts[id] || 0)) / 100).toFixed(2)),
          percentage: splitAmounts[id] || 0,
        }));

      case "shares":
        const totalShares = Object.values(splitAmounts).reduce(
          (a, b) => a + (b || 0),
          0
        );
        return allParticipants.map((id) => ({
          userId: id,
          amount:
            totalShares > 0
              ? parseFloat(((num * (splitAmounts[id] || 0)) / totalShares).toFixed(2))
              : 0,
          shares: splitAmounts[id] || 0,
        }));

      default:
        return [];
    }
  };

  const handleSubmit = () => {
    if (!description || !amount || !user) return;

    const splits = calculateSplits();

    addExpense({
      description,
      amount: parseFloat(amount),
      currency,
      category,
      paidBy,
      splitMethod,
      splits,
      groupId,
      isRecurring,
      date: new Date().toISOString(),
      notes: notes || undefined,
    });

    handleClose();
  };

  const splitMethodIcons = {
    equal: <Divide className="w-4 h-4" />,
    exact: <Calculator className="w-4 h-4" />,
    percentage: <Percent className="w-4 h-4" />,
    shares: <Scale className="w-4 h-4" />,
  };

  const allParticipants = [user, ...friends.map((f) => f.friend)].filter(
    (p): p is NonNullable<typeof p> => p !== null && p !== undefined
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#1D9C5A]" />
            Add Expense
          </DialogTitle>
          <DialogDescription>
            Step {step} of 3:{" "}
            {step === 1
              ? "Basic Details"
              : step === 2
              ? "Select Participants"
              : "Split Details"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={currency}
                  onValueChange={(v) => setCurrency(v as CurrencyCode)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: c.color }}
                        />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid by</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={user?.id || ""}>You</SelectItem>
                  {friends.map((friend) => (
                    <SelectItem key={friend.friendId} value={friend.friendId}>
                      {friend.friend.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) =>
                  setIsRecurring(checked as boolean)
                }
              />
              <Label htmlFor="recurring" className="text-sm font-normal">
                This is a recurring expense
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Add any additional details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select who to split this expense with:
            </p>
            <div className="space-y-2">
              {friends.map((friend) => (
                <div
                  key={friend.friendId}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => {
                    setSelectedFriends((prev) =>
                      prev.includes(friend.friendId)
                        ? prev.filter((id) => id !== friend.friendId)
                        : [...prev, friend.friendId]
                    );
                  }}
                >
                  <Checkbox
                    checked={selectedFriends.includes(friend.friendId)}
                    onCheckedChange={() => {}}
                  />
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                      {getInitials(friend.friend.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1">{friend.friend.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Tabs value={splitMethod} onValueChange={(v) => setSplitMethod(v as SplitMethod)}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="equal">Equal</TabsTrigger>
                <TabsTrigger value="exact">Exact</TabsTrigger>
                <TabsTrigger value="percentage">%</TabsTrigger>
                <TabsTrigger value="shares">Shares</TabsTrigger>
              </TabsList>

              <TabsContent value="equal" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Split equally among {selectedFriends.length + 1} people
                </p>
                <div className="space-y-2">
                  {[user, ...friends.filter((f) =>
                    selectedFriends.includes(f.friendId)
                  ).map(f => f.friend)].map((participant) =>
                    participant ? (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                              {getInitials(participant.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {participant.id === user?.id
                              ? "You"
                              : participant.name}
                          </span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(
                            (parseFloat(amount) || 0) /
                              (selectedFriends.length + 1),
                            currency
                          )}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              </TabsContent>

              <TabsContent value="exact" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter exact amounts for each person:
                </p>
                <div className="space-y-2">
                  {[user, ...friends.filter((f) =>
                    selectedFriends.includes(f.friendId)
                  ).map(f => f.friend)].map((participant) =>
                    participant ? (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                            {getInitials(participant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1">
                          {participant.id === user?.id
                            ? "You"
                            : participant.name}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          className="w-24"
                          placeholder="0.00"
                          value={splitAmounts[participant.id] || ""}
                          onChange={(e) =>
                            setSplitAmounts((prev) => ({
                              ...prev,
                              [participant.id]: parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    ) : null
                  )}
                </div>
              </TabsContent>

              <TabsContent value="percentage" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter percentages for each person (total should be 100%):
                </p>
                <div className="space-y-2">
                  {[user, ...friends.filter((f) =>
                    selectedFriends.includes(f.friendId)
                  ).map(f => f.friend)].map((participant) =>
                    participant ? (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                            {getInitials(participant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1">
                          {participant.id === user?.id
                            ? "You"
                            : participant.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="1"
                            className="w-20"
                            placeholder="0"
                            value={splitAmounts[participant.id] || ""}
                            onChange={(e) =>
                              setSplitAmounts((prev) => ({
                                ...prev,
                                [participant.id]: parseFloat(e.target.value) || 0,
                              }))
                            }
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </TabsContent>

              <TabsContent value="shares" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter shares for each person:
                </p>
                <div className="space-y-2">
                  {[user, ...friends.filter((f) =>
                    selectedFriends.includes(f.friendId)
                  ).map(f => f.friend)].map((participant) =>
                    participant ? (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                            {getInitials(participant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1">
                          {participant.id === user?.id
                            ? "You"
                            : participant.name}
                        </span>
                        <Input
                          type="number"
                          step="1"
                          className="w-24"
                          placeholder="0"
                          value={splitAmounts[participant.id] || ""}
                          onChange={(e) =>
                            setSplitAmounts((prev) => ({
                              ...prev,
                              [participant.id]: parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    ) : null
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              className="bg-[#1D9C5A] hover:bg-[#157A46]"
              onClick={() => setStep(step + 1)}
              disabled={
                step === 1
                  ? !description || !amount
                  : step === 2
                  ? selectedFriends.length === 0
                  : false
              }
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-[#1D9C5A] hover:bg-[#157A46]"
              onClick={handleSubmit}
            >
              Add Expense
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
