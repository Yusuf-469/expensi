"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  DollarSign,
  Bell,
  Moon,
  Shield,
  LogOut,
  Camera,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/expensi/AppLayout";
import { CurrencyConverter } from "@/components/expensi/CurrencyConverter";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { formatCurrency, getInitials } from "@/lib/utils";
import { CURRENCIES, CurrencyCode } from "@/types";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const { balances } = useExpenses();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currency, setCurrency] = useState<CurrencyCode>(
    user?.defaultCurrency || "USD"
  );

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    expenses: true,
    settlements: true,
  });

  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    updateUser({
      name,
      email,
      defaultCurrency: currency,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and preferences
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#1D9C5A]" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-2xl">
                      {user ? getInitials(user.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.name}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since{" "}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
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
                            {c.symbol} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#1D9C5A] hover:bg-[#157A46]"
                      onClick={handleSave}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{user?.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Default Currency
                      </Label>
                      <p className="font-medium">
                        {CURRENCIES.find((c) => c.code === user?.defaultCurrency)
                          ?.symbol || "$"}{" "}
                        {user?.defaultCurrency}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        Total Balance
                      </Label>
                      <p
                        className={`font-medium ${
                          balances.netBalance >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(
                          balances.netBalance,
                          balances.currency
                        )}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#1D9C5A]" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, push: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Expense Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Notify when expenses are added
                  </p>
                </div>
                <Switch
                  checked={notifications.expenses}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, expenses: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Settlement Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Notify when payments are made
                  </p>
                </div>
                <Switch
                  checked={notifications.settlements}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      settlements: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-[#1D9C5A]" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#1D9C5A]" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Currency Converter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CurrencyConverter />
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">Log Out</p>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
