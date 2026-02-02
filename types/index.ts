// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  defaultCurrency: CurrencyCode;
  createdAt: string;
}

// Currency Types
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export function getCurrencySymbol(code: CurrencyCode): string {
  return CURRENCIES.find(c => c.code === code)?.symbol || '$';
}

// Category Types
export type Category = 'Food' | 'Travel' | 'Rent' | 'Utilities' | 'Entertainment' | 'Shopping' | 'Health' | 'Other';

export interface CategoryInfo {
  name: Category;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { name: 'Food', icon: 'Utensils', color: '#F97316' },
  { name: 'Travel', icon: 'Plane', color: '#3B82F6' },
  { name: 'Rent', icon: 'Home', color: '#8B5CF6' },
  { name: 'Utilities', icon: 'Zap', color: '#EAB308' },
  { name: 'Entertainment', icon: 'Film', color: '#EC4899' },
  { name: 'Shopping', icon: 'ShoppingBag', color: '#14B8A6' },
  { name: 'Health', icon: 'Heart', color: '#EF4444' },
  { name: 'Other', icon: 'MoreHorizontal', color: '#6B7280' },
];

// Split Types
export type SplitMethod = 'equal' | 'exact' | 'percentage' | 'shares';

export interface SplitMember {
  userId: string;
  amount: number;
  percentage?: number;
  shares?: number;
}

// Expense Types
export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  category: Category;
  paidBy: string;
  splitMethod: SplitMethod;
  splits: SplitMember[];
  groupId?: string;
  receipt?: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Friend Types
export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend: User;
  balance: number;
  status: 'pending' | 'accepted';
  createdAt: string;
}

// Group Types
export type GroupType = 'Trip' | 'Home' | 'Event' | 'Other';

export interface Group {
  id: string;
  name: string;
  type: GroupType;
  createdBy: string;
  members: GroupMember[];
  totalExpenses: number;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface GroupMember {
  userId: string;
  user: User;
  balance: number;
  joinedAt: string;
}

// Activity Types
export type ActivityType = 'expense_created' | 'expense_updated' | 'expense_deleted' | 'settlement' | 'friend_added' | 'group_created' | 'group_joined' | 'comment';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  user: User;
  description: string;
  metadata?: {
    expenseId?: string;
    groupId?: string;
    friendId?: string;
    amount?: number;
    currency?: CurrencyCode;
  };
  createdAt: string;
}

// Settlement Types
export interface Settlement {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: CurrencyCode;
  method: 'cash' | 'stripe' | 'venmo' | 'paypal';
  groupId?: string;
  notes?: string;
  createdAt: string;
}

// Balance Types
export interface Balance {
  userId: string;
  amount: number;
  currency: CurrencyCode;
}

export interface UserBalances {
  totalOwed: number;
  totalOwe: number;
  netBalance: number;
  currency: CurrencyCode;
  friendBalances: Record<string, number>;
  groupBalances: Record<string, number>;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Filter Types
export interface ExpenseFilters {
  dateRange?: { from?: Date; to?: Date };
  categories?: Category[];
  friends?: string[];
  groups?: string[];
  minAmount?: number;
  maxAmount?: number;
}

// Chart Data Types
export interface MonthlySpending {
  month: string;
  amount: number;
}

export interface CategorySpending {
  category: Category;
  amount: number;
  percentage: number;
}

export interface FriendSpending {
  friendId: string;
  friendName: string;
  amount: number;
}
