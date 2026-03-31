"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EQUIVALENT_ITEMS,
  calculateEquivalent,
  formatEquivalentCount,
  type EquivalentItem,
} from "@/lib/life-equivalents";
import { formatCurrency } from "@/lib/debt-calculator";

interface LifeEquivalentsProps {
  amount: number;
  /** Optional: second amount to show delta framing (e.g. "saved X") */
  label?: string;
  title?: string;
}

export function LifeEquivalents({
  amount,
  label = "это",
  title = "Понять сумму проще",
}: LifeEquivalentsProps) {
  const [selected, setSelected] = useState<EquivalentItem>(EQUIVALENT_ITEMS[0]);
  const count = calculateEquivalent(amount, selected);

  return (
    <div className="rounded-2xl bg-white border border-[#E7ECF3] shadow-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
        <span className="text-xs font-medium text-[#667085] bg-[#F7F8FC] border border-[#E7ECF3] px-2.5 py-1 rounded-full">
          {formatCurrency(amount)}
        </span>
      </div>

      {/* Main display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="bg-[#F7F8FC] rounded-xl px-5 py-4 text-center"
        >
          <p className="text-4xl mb-2">{selected.emoji}</p>
          <p className="text-3xl font-bold tabular-nums text-[#0F172A] font-numeric leading-none">
            {formatEquivalentCount(count)}
          </p>
          <p className="text-sm text-[#667085] mt-1.5">
            {label}{" "}
            <span className="font-medium text-[#0F172A]">
              {formatEquivalentCount(count)} × {selected.label}
            </span>
          </p>
          <p className="text-xs text-[#94a3b8] mt-1">{selected.caption}</p>
        </motion.div>
      </AnimatePresence>

      {/* Selector chips */}
      <div className="flex flex-wrap gap-1.5">
        {EQUIVALENT_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
              selected.id === item.id
                ? "bg-[#6C63FF] text-white shadow-sm"
                : "bg-[#F7F8FC] text-[#667085] border border-[#E7ECF3] hover:bg-[#EEF2FF] hover:text-[#6C63FF] hover:border-[#6C63FF]/30"
            }`}
          >
            <span>{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
