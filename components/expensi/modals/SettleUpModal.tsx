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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { CURRENCIES, CurrencyCode } from "@/types";
import { getInitials, formatCurrency } from "@/lib/utils";
import { HandCoins, Wallet, CreditCard, Banknote } from "lucide-react";

interface SettleUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "venmo", label: "Venmo", icon: Wallet },
  { value: "paypal", label: "PayPal", icon: CreditCard },
  { value: "stripe", label: "Card/Online", icon: CreditCard },
];

export function SettleUpModal({ open, onOpenChange }: SettleUpModalProps) {
  const { user } = useAuth();
  const { friends, balances, addSettlement } = useExpenses();
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>(
    user?.defaultCurrency || "USD"
  );
  const [method, setMethod] = useState("cash");
  const [notes, setNotes] = useState("");

  // Filter friends that user owes money to (negative balance means user owes them)
  const friendsIOwe = friends.filter(
    (friend) => balances.friendBalances[friend.friendId] < 0
  );

  const selectedFriend = friends.find((f) => f.friendId === toUserId);
  const maxAmount = selectedFriend
    ? Math.abs(balances.friendBalances[selectedFriend.friendId] || 0)
    : 0;

  const handleSubmit = () => {
    if (!toUserId || !amount || !user) return;

    addSettlement({
      fromUserId: user.id,
      toUserId,
      amount: parseFloat(amount),
      currency,
      method: method as "cash" | "venmo" | "paypal" | "stripe",
      notes: notes || undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setToUserId("");
    setAmount("");
    setCurrency(user?.defaultCurrency || "USD");
    setMethod("cash");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HandCoins className="w-5 h-5 text-[#1D9C5A]" />
            Settle Up
          </DialogTitle>
          <DialogDescription>
            Record a payment to settle your debts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {friendsIOwe.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You don't owe anyone money!</p>
              <p className="text-sm">Great job keeping your balances even.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="to">Pay to</Label>
                <Select value={toUserId} onValueChange={setToUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a friend" />
                  </SelectTrigger>
                  <SelectContent>
                    {friendsIOwe.map((friend) => (
                      <SelectItem key={friend.friendId} value={friend.friendId}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                              {getInitials(friend.friend.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{friend.friend.name}</span>
                          <span className="text-muted-foreground text-sm ml-auto">
                            owes you{" "}
                            {formatCurrency(
                              Math.abs(
                                balances.friendBalances[friend.friendId] || 0
                              ),
                              user?.defaultCurrency || "USD"
                            )}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedFriend && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You owe {selectedFriend.friend.name}{" "}
                    <span className="font-medium text-foreground">
                      {formatCurrency(
                        Math.abs(
                          balances.friendBalances[selectedFriend.friendId] || 0
                        ),
                        user?.defaultCurrency || "USD"
                      )}
                    </span>
                  </p>
                </div>
              )}

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
                    max={maxAmount}
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
                <Label htmlFor="method">Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.value}
                        type="button"
                        onClick={() => setMethod(pm.value)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                          method === pm.value
                            ? "border-[#1D9C5A] bg-[#1D9C5A]/10"
                            : "hover:bg-accent"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Add a note about this payment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {friendsIOwe.length > 0 && (
            <Button
              className="bg-[#1D9C5A] hover:bg-[#157A46]"
              onClick={handleSubmit}
              disabled={!toUserId || !amount}
            >
              Record Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
