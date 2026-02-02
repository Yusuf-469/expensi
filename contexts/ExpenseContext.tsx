'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { 
  Expense, 
  Friend, 
  Group, 
  GroupMember,
  Activity, 
  Settlement, 
  Notification,
  User,
  SplitMember,
  UserBalances,
  Category,
  GroupType,
  CurrencyCode,
} from '../types';
import { useLocalStorage } from '../lib/hooks/useLocalStorage';
import { generateId } from '../lib/utils';
import { useAuth } from './AuthContext';
import { useToast } from '../components/expensi/ToastProvider';

interface ExpenseContextType {
  // Data
  expenses: Expense[];
  friends: Friend[];
  groups: Group[];
  activities: Activity[];
  settlements: Settlement[];
  notifications: Notification[];
  
  // Computed
  balances: UserBalances;
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  addFriend: (friendId: string, friendData: User) => void;
  removeFriend: (friendId: string) => void;
  acceptFriend: (friendId: string) => void;
  
  addGroup: (name: string, type: GroupType, members: string[]) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addGroupMember: (groupId: string, userId: string, user: User) => void;
  removeGroupMember: (groupId: string, userId: string) => void;
  
  addSettlement: (settlement: Omit<Settlement, 'id' | 'createdAt'>) => void;
  
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  
  getFriendExpenses: (friendId: string) => Expense[];
  getGroupExpenses: (groupId: string) => Expense[];
  getFriendBalance: (friendId: string) => number;
  getGroupBalance: (groupId: string) => number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Demo data
const DEMO_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    description: 'Dinner at Italian Place',
    amount: 85.50,
    currency: 'USD',
    category: 'Food',
    paidBy: 'user-1',
    splitMethod: 'equal',
    splits: [
      { userId: 'user-1', amount: 28.50 },
      { userId: 'user-2', amount: 28.50 },
      { userId: 'user-3', amount: 28.50 },
    ],
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isRecurring: false,
  },
  {
    id: 'exp-2',
    description: 'Uber to Airport',
    amount: 45.00,
    currency: 'USD',
    category: 'Travel',
    paidBy: 'user-2',
    splitMethod: 'equal',
    splits: [
      { userId: 'user-1', amount: 22.50 },
      { userId: 'user-2', amount: 22.50 },
    ],
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    isRecurring: false,
  },
  {
    id: 'exp-3',
    description: 'Monthly Rent',
    amount: 1200.00,
    currency: 'USD',
    category: 'Rent',
    paidBy: 'user-1',
    splitMethod: 'equal',
    splits: [
      { userId: 'user-1', amount: 600.00 },
      { userId: 'user-2', amount: 600.00 },
    ],
    groupId: 'group-1',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    isRecurring: true,
    recurringFrequency: 'monthly',
  },
];

const DEMO_FRIENDS: Friend[] = [
  {
    id: 'friend-1',
    userId: 'user-1',
    friendId: 'user-2',
    friend: {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '',
      defaultCurrency: 'USD',
      createdAt: new Date().toISOString(),
    },
    balance: 6.00, // Jane owes John $6
    status: 'accepted',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'friend-2',
    userId: 'user-1',
    friendId: 'user-3',
    friend: {
      id: 'user-3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: '',
      defaultCurrency: 'EUR',
      createdAt: new Date().toISOString(),
    },
    balance: -28.50, // John owes Mike $28.50
    status: 'accepted',
    createdAt: new Date().toISOString(),
  },
];

const DEMO_GROUPS: Group[] = [
  {
    id: 'group-1',
    name: 'Apartment 4B',
    type: 'Home',
    createdBy: 'user-1',
    members: [
      {
        userId: 'user-1',
        user: {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '',
          defaultCurrency: 'USD',
          createdAt: new Date().toISOString(),
        },
        balance: 600,
        joinedAt: new Date().toISOString(),
      },
      {
        userId: 'user-2',
        user: {
          id: 'user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: '',
          defaultCurrency: 'USD',
          createdAt: new Date().toISOString(),
        },
        balance: -600,
        joinedAt: new Date().toISOString(),
      },
    ],
    totalExpenses: 1200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEMO_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    type: 'expense_created',
    userId: 'user-1',
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '',
      defaultCurrency: 'USD',
      createdAt: new Date().toISOString(),
    },
    description: 'added "Dinner at Italian Place"',
    metadata: {
      expenseId: 'exp-1',
      amount: 85.50,
      currency: 'USD',
    },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'act-2',
    type: 'expense_created',
    userId: 'user-2',
    user: {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '',
      defaultCurrency: 'USD',
      createdAt: new Date().toISOString(),
    },
    description: 'added "Uber to Airport"',
    metadata: {
      expenseId: 'exp-2',
      amount: 45.00,
      currency: 'USD',
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expensi_expenses', DEMO_EXPENSES);
  const [friends, setFriends] = useLocalStorage<Friend[]>('expensi_friends', DEMO_FRIENDS);
  const [groups, setGroups] = useLocalStorage<Group[]>('expensi_groups', DEMO_GROUPS);
  const [activities, setActivities] = useLocalStorage<Activity[]>('expensi_activities', DEMO_ACTIVITIES);
  const [settlements, setSettlements] = useLocalStorage<Settlement[]>('expensi_settlements', []);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('expensi_notifications', []);

  // Calculate balances
  const balances = useMemo((): UserBalances => {
    if (!user) {
      return {
        totalOwed: 0,
        totalOwe: 0,
        netBalance: 0,
        currency: 'USD',
        friendBalances: {},
        groupBalances: {},
      };
    }

    let totalOwed = 0;
    let totalOwe = 0;
    const friendBalances: Record<string, number> = {};
    const groupBalances: Record<string, number> = {};

    // Calculate from expenses
    expenses.forEach(expense => {
      const userSplit = expense.splits.find(s => s.userId === user.id);
      
      if (expense.paidBy === user.id) {
        // User paid, others owe them
        const othersOwe = expense.splits
          .filter(s => s.userId !== user.id)
          .reduce((sum, s) => sum + s.amount, 0);
        totalOwed += othersOwe;
        
        // Track per friend
        expense.splits
          .filter(s => s.userId !== user.id)
          .forEach(split => {
            friendBalances[split.userId] = (friendBalances[split.userId] || 0) + split.amount;
          });
      } else if (userSplit) {
        // Someone else paid, user owes them
        totalOwe += userSplit.amount;
        friendBalances[expense.paidBy] = (friendBalances[expense.paidBy] || 0) - userSplit.amount;
      }
      
      // Track group balances
      if (expense.groupId) {
        if (expense.paidBy === user.id) {
          const othersOwe = expense.splits
            .filter(s => s.userId !== user.id)
            .reduce((sum, s) => sum + s.amount, 0);
          groupBalances[expense.groupId] = (groupBalances[expense.groupId] || 0) + othersOwe;
        } else if (userSplit) {
          groupBalances[expense.groupId] = (groupBalances[expense.groupId] || 0) - userSplit.amount;
        }
      }
    });

    // Subtract settlements
    settlements.forEach(settlement => {
      if (settlement.fromUserId === user.id) {
        totalOwe -= settlement.amount;
        friendBalances[settlement.toUserId] = (friendBalances[settlement.toUserId] || 0) + settlement.amount;
      } else if (settlement.toUserId === user.id) {
        totalOwed -= settlement.amount;
        friendBalances[settlement.fromUserId] = (friendBalances[settlement.fromUserId] || 0) - settlement.amount;
      }
    });

    return {
      totalOwed: Math.max(0, totalOwed),
      totalOwe: Math.max(0, totalOwe),
      netBalance: totalOwed - totalOwe,
      currency: user.defaultCurrency,
      friendBalances,
      groupBalances,
    };
  }, [expenses, settlements, user]);

  // Expense actions
  const addExpense = useCallback((expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    
    // Show toast
    addToast({
      title: "Expense added",
      description: `"${expenseData.description}" for ${expenseData.currency} ${expenseData.amount.toFixed(2)}`,
      type: "success",
    });
    
    // Add activity
    if (user) {
      const newActivity: Activity = {
        id: generateId(),
        type: 'expense_created',
        userId: user.id,
        user,
        description: `added "${expenseData.description}"`,
        metadata: {
          expenseId: newExpense.id,
          amount: expenseData.amount,
          currency: expenseData.currency,
        },
        createdAt: new Date().toISOString(),
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  }, [setExpenses, setActivities, user, addToast]);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => 
      e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
    ));
  }, [setExpenses]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, [setExpenses]);

  // Friend actions
  const addFriend = useCallback((friendId: string, friendData: User) => {
    if (!user) return;
    
    const newFriend: Friend = {
      id: generateId(),
      userId: user.id,
      friendId,
      friend: friendData,
      balance: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setFriends(prev => [...prev, newFriend]);
  }, [setFriends, user]);

  const removeFriend = useCallback((friendId: string) => {
    setFriends(prev => prev.filter(f => f.friendId !== friendId));
  }, [setFriends]);

  const acceptFriend = useCallback((friendId: string) => {
    setFriends(prev => prev.map(f => 
      f.friendId === friendId ? { ...f, status: 'accepted' } : f
    ));
  }, [setFriends]);

  // Group actions
  const addGroup = useCallback((name: string, type: GroupType, memberIds: string[]) => {
    if (!user) return;
    
    const members: GroupMember[] = [{
      userId: user.id,
      user,
      balance: 0,
      joinedAt: new Date().toISOString(),
    }];
    
    // Add other members
    memberIds.forEach(id => {
      const friend = friends.find(f => f.friendId === id);
      if (friend) {
        members.push({
          userId: id,
          user: friend.friend,
          balance: 0,
          joinedAt: new Date().toISOString(),
        });
      }
    });
    
    const newGroup: Group = {
      id: generateId(),
      name,
      type,
      createdBy: user.id,
      members,
      totalExpenses: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setGroups(prev => [...prev, newGroup]);
  }, [setGroups, user, friends]);

  const updateGroup = useCallback((id: string, updates: Partial<Group>) => {
    setGroups(prev => prev.map(g => 
      g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
    ));
  }, [setGroups]);

  const deleteGroup = useCallback((id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
  }, [setGroups]);

  const addGroupMember = useCallback((groupId: string, userId: string, userData: User) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        members: [...g.members, {
          userId,
          user: userData,
          balance: 0,
          joinedAt: new Date().toISOString(),
        }],
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [setGroups]);

  const removeGroupMember = useCallback((groupId: string, userId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        members: g.members.filter(m => m.userId !== userId),
        updatedAt: new Date().toISOString(),
      };
    }));
  }, [setGroups]);

  // Settlement actions
  const addSettlement = useCallback((settlementData: Omit<Settlement, 'id' | 'createdAt'>) => {
    const newSettlement: Settlement = {
      ...settlementData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    setSettlements(prev => [...prev, newSettlement]);
    
    // Show toast
    addToast({
      title: "Payment recorded",
      description: `Settled ${settlementData.currency} ${settlementData.amount.toFixed(2)}`,
      type: "success",
    });
    
    // Add activity
    if (user) {
      const newActivity: Activity = {
        id: generateId(),
        type: 'settlement',
        userId: user.id,
        user,
        description: `settled up ${settlementData.amount} ${settlementData.currency}`,
        metadata: {
          amount: settlementData.amount,
          currency: settlementData.currency,
        },
        createdAt: new Date().toISOString(),
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  }, [setSettlements, setActivities, user, addToast]);

  // Notification actions
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, [setNotifications]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [setNotifications]);

  // Helper functions
  const getFriendExpenses = useCallback((friendId: string): Expense[] => {
    if (!user) return [];
    return expenses.filter(e => 
      e.paidBy === friendId || e.splits.some(s => s.userId === friendId)
    );
  }, [expenses, user]);

  const getGroupExpenses = useCallback((groupId: string): Expense[] => {
    return expenses.filter(e => e.groupId === groupId);
  }, [expenses]);

  const getFriendBalance = useCallback((friendId: string): number => {
    return balances.friendBalances[friendId] || 0;
  }, [balances]);

  const getGroupBalance = useCallback((groupId: string): number => {
    return balances.groupBalances[groupId] || 0;
  }, [balances]);

  return (
    <ExpenseContext.Provider value={{
      expenses,
      friends,
      groups,
      activities,
      settlements,
      notifications,
      balances,
      addExpense,
      updateExpense,
      deleteExpense,
      addFriend,
      removeFriend,
      acceptFriend,
      addGroup,
      updateGroup,
      deleteGroup,
      addGroupMember,
      removeGroupMember,
      addSettlement,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      getFriendExpenses,
      getGroupExpenses,
      getFriendBalance,
      getGroupBalance,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
