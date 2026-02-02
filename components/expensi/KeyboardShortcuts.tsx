"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface KeyboardShortcutsProps {
  onAddExpense?: () => void;
  onSettleUp?: () => void;
  onSearch?: () => void;
}

export function KeyboardShortcuts({
  onAddExpense,
  onSettleUp,
  onSearch,
}: KeyboardShortcutsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        // Allow Escape key even in inputs
        if (e.key !== "Escape") return;
      }

      // Don't trigger if any modal is open
      const isModalOpen = document.querySelector("[data-state='open']");
      if (isModalOpen && e.key !== "Escape") return;

      const key = e.key.toLowerCase();

      // Navigation shortcuts
      if (e.altKey) {
        switch (key) {
          case "d":
            e.preventDefault();
            router.push("/dashboard");
            break;
          case "e":
            e.preventDefault();
            router.push("/expenses");
            break;
          case "f":
            e.preventDefault();
            router.push("/friends");
            break;
          case "g":
            e.preventDefault();
            router.push("/groups");
            break;
          case "a":
            e.preventDefault();
            router.push("/activity");
            break;
          case "n":
            e.preventDefault();
            router.push("/analytics");
            break;
        }
      }

      // Action shortcuts
      if (!e.altKey && !e.ctrlKey && !e.metaKey) {
        switch (key) {
          case "n":
            e.preventDefault();
            onAddExpense?.();
            break;
          case "s":
            e.preventDefault();
            onSettleUp?.();
            break;
          case "/":
            e.preventDefault();
            onSearch?.();
            break;
          case "?":
            e.preventDefault();
            // Show keyboard shortcuts help
            break;
        }
      }

      // Escape to close modals
      if (e.key === "Escape") {
        // Let the modal handle this
      }
    },
    [router, onAddExpense, onSettleUp, onSearch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return null;
}

// Hook to use keyboard shortcuts in any component
export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const shortcut = shortcuts[key];
      if (shortcut && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        shortcut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
