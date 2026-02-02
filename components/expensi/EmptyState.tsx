"use client";

import { motion } from "framer-motion";
import { Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-[#1D9C5A]/10 flex items-center justify-center mb-6">
        {icon || <Wallet className="w-12 h-12 text-[#1D9C5A]" />}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-[#1D9C5A] hover:bg-[#157A46]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
