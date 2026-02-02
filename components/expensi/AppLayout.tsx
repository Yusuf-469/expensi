"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  Users,
  FolderOpen,
  Bell,
  Settings,
  LogOut,
  Plus,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { useTheme } from "./ThemeProvider";
import { getInitials, formatCurrency } from "@/lib/utils";
import { AddExpenseModal } from "./modals/AddExpenseModal";
import { SettleUpModal } from "./modals/SettleUpModal";
import { KeyboardShortcuts } from "./KeyboardShortcuts";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Friends", href: "/friends", icon: Users },
  { name: "Groups", href: "/groups", icon: FolderOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Activity", href: "/activity", icon: Bell },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { balances, notifications } = useExpenses();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleUpOpen, setIsSettleUpOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 h-screen bg-card border-r border-border z-40 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1D9C5A] flex items-center justify-center text-white">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Expensi</span>
            </div>

            <ScrollArea className="flex-1 px-4">
              {/* Balance Card */}
              <div className="mb-6 p-4 bg-gradient-to-br from-[#1D9C5A] to-[#157A46] rounded-xl text-white">
                <p className="text-sm opacity-90 mb-1">Total Balance</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(balances.netBalance, balances.currency)}
                </p>
                <div className="mt-3 flex gap-4 text-sm">
                  <div>
                    <p className="opacity-75">You are owed</p>
                    <p className="font-semibold">
                      {formatCurrency(balances.totalOwed, balances.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="opacity-75">You owe</p>
                    <p className="font-semibold">
                      {formatCurrency(balances.totalOwe, balances.currency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="bg-[#1D9C5A] hover:bg-[#157A46]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsSettleUpOpen(true)}
                >
                  Settle Up
                </Button>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#1D9C5A]/10 text-[#1D9C5A] font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                      {item.name === "Activity" && unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-auto text-xs"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* User Section */}
            <div className="p-4 border-t border-border space-y-2">
              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-10"
                  >
                    {resolvedTheme === "dark" ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                    <span className="flex-1 text-left">
                      {theme === "system" ? "System" : resolvedTheme === "dark" ? "Dark" : "Light"}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                    {theme === "light" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                    {theme === "dark" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                    {theme === "system" && <span className="ml-auto">✓</span>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto py-3"
                  >
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A]">
                        {user ? getInitials(user.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-[280px]" : "ml-0"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <h1 className="text-lg font-semibold">
                {navItems.find((item) => item.href === pathname)?.name ||
                  "Expensi"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddExpenseOpen(true)}
                className="hidden sm:flex"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Expense
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Modals */}
      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
      <SettleUpModal open={isSettleUpOpen} onOpenChange={setIsSettleUpOpen} />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onAddExpense={() => setIsAddExpenseOpen(true)}
        onSettleUp={() => setIsSettleUpOpen(true)}
      />
    </div>
  );
}
