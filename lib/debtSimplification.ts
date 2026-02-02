/**
 * Debt Simplification Algorithm
 * 
 * This algorithm minimizes the number of transactions needed to settle all debts
 * within a group by finding optimal payment paths.
 * 
 * How it works:
 * 1. Calculate net balance for each person (what they're owed minus what they owe)
 * 2. Separate into creditors (positive balance) and debtors (negative balance)
 * 3. Match debtors to creditors to minimize transactions
 */

export interface PersonBalance {
  userId: string;
  name: string;
  balance: number; // Positive = owed money, Negative = owes money
}

export interface SimplifiedTransaction {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

/**
 * Simplify debts within a group
 */
export function simplifyDebts(balances: PersonBalance[]): SimplifiedTransaction[] {
  const transactions: SimplifiedTransaction[] = [];
  
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances
    .filter(b => b.balance > 0.01) // Small threshold to avoid floating point issues
    .sort((a, b) => b.balance - a.balance);
    
  const debtors = balances
    .filter(b => b.balance < -0.01)
    .sort((a, b) => a.balance - b.balance)
    .map(d => ({ ...d, balance: Math.abs(d.balance) })); // Make positive for easier math

  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.balance, creditor.balance);
    
    if (amount > 0.01) {
      transactions.push({
        from: debtor.userId,
        fromName: debtor.name,
        to: creditor.userId,
        toName: creditor.name,
        amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
      });
    }
    
    debtor.balance -= amount;
    creditor.balance -= amount;
    
    if (debtor.balance < 0.01) i++;
    if (creditor.balance < 0.01) j++;
  }

  return transactions;
}

/**
 * Calculate optimal payment path between two people through mutual friends
 * This can reduce the number of transactions in some cases
 */
export function findOptimalPath(
  fromUserId: string,
  toUserId: string,
  allBalances: Map<string, Map<string, number>>
): { path: string[]; amount: number } | null {
  // BFS to find shortest path
  const visited = new Set<string>();
  const queue: { userId: string; path: string[]; minAmount: number }[] = [
    { userId: fromUserId, path: [fromUserId], minAmount: Infinity }
  ];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current.userId === toUserId && current.path.length > 1) {
      return {
        path: current.path,
        amount: current.minAmount
      };
    }
    
    if (visited.has(current.userId)) continue;
    visited.add(current.userId);
    
    const userBalances = allBalances.get(current.userId);
    if (!userBalances) continue;
    
    for (const [otherUserId, balance] of userBalances.entries()) {
      if (!visited.has(otherUserId) && balance > 0) {
        queue.push({
          userId: otherUserId,
          path: [...current.path, otherUserId],
          minAmount: Math.min(current.minAmount, balance)
        });
      }
    }
  }
  
  return null;
}

/**
 * Calculate suggested settlements to minimize total transactions
 * across all friends
 */
export function calculateSuggestedSettlements(
  friendBalances: Record<string, number>,
  friendNames: Record<string, string>
): SimplifiedTransaction[] {
  const balances: PersonBalance[] = Object.entries(friendBalances).map(([userId, balance]) => ({
    userId,
    name: friendNames[userId] || "Unknown",
    balance
  }));
  
  return simplifyDebts(balances);
}

/**
 * Get a summary of who owes whom in a simplified format
 */
export function getDebtSummary(
  transactions: SimplifiedTransaction[]
): string[] {
  return transactions.map(t => 
    `${t.fromName} pays ${t.toName} $${t.amount.toFixed(2)}`
  );
}
