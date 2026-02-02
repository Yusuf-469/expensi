"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const icons = {
  success: Check,
  error: X,
  info: Info,
  warning: AlertCircle,
};

const colors = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500",
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${colors[toast.type]} min-w-[300px]`}
    >
      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Hook for using toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
