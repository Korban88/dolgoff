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
  label?: string;
  title?: string;
}

export function LifeEquivalents({
  amount,
  label = "это",
  title = "Ощутить сумму",
}: LifeEquivalentsProps) {
  const [selected, setSelected] = useState<EquivalentItem>(EQUIVALENT_ITEMS[0]);
  const count = calculateEquivalent(amount, selected);

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "var(--radius-card)",
        padding: "24px",
        boxShadow: "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>{title}</p>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#8A8A8A",
            background: "var(--surface-elevated)",
            border: "1px solid var(--border-card)",
            borderRadius: "20px",
            padding: "4px 12px",
          }}
        >
          {formatCurrency(amount)}
        </span>
      </div>

      {/* Main display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.20, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: "var(--surface-elevated)",
            borderRadius: "12px",
            padding: "28px 20px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "48px", lineHeight: 1, marginBottom: "12px" }}>{selected.emoji}</p>
          <p
            style={{
              fontSize: "40px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatEquivalentCount(count)}
          </p>
          <p style={{ fontSize: "13px", color: "#555555", marginTop: "8px" }}>
            {label}{" "}
            <span style={{ fontWeight: 600, color: "#8A8A8A" }}>
              {selected.label}
            </span>
          </p>
          <p style={{ fontSize: "11.5px", color: "#555555", marginTop: "4px" }}>{selected.caption}</p>
        </motion.div>
      </AnimatePresence>

      {/* Selector chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {EQUIVALENT_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            style={
              selected.id === item.id
                ? {
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "6px 16px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 600,
                    background: "#B5F562",
                    color: "#0A0A0A",
                    border: "1px solid #B5F562",
                    cursor: "pointer",
                  }
                : {
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "6px 16px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 500,
                    background: "var(--surface-elevated)",
                    color: "#8A8A8A",
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                  }
            }
          >
            <span>{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
