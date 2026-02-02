import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  
  return formatDate(date);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
