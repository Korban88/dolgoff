"use client";

import { useState, useEffect, useCallback } from "react";
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

const AUTO_ROTATE_MS = 3500;

export function LifeEquivalents({
  amount,
  label = "это",
  title = "Ощутить сумму",
}: LifeEquivalentsProps) {
  const [selected, setSelected] = useState<EquivalentItem>(EQUIVALENT_ITEMS[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const count = calculateEquivalent(amount, selected);

  // Auto-rotate when not manually interacted
  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      setSelected((prev) => {
        const idx = EQUIVALENT_ITEMS.indexOf(prev);
        return EQUIVALENT_ITEMS[(idx + 1) % EQUIVALENT_ITEMS.length];
      });
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [autoRotate]);

  // Manual select: pause auto-rotation for 8s, then resume
  const handleSelect = useCallback((item: EquivalentItem) => {
    setSelected(item);
    setAutoRotate(false);
    const resume = setTimeout(() => setAutoRotate(true), 8000);
    return () => clearTimeout(resume);
  }, []);

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
        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{title}</p>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-secondary)",
            background: "var(--bg-input)",
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
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: "var(--bg-input)",
            borderRadius: "12px",
            padding: "24px 20px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "44px", lineHeight: 1, marginBottom: "10px" }}>{selected.emoji}</p>
          <p
            style={{
              fontSize: "36px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatEquivalentCount(count)}
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "8px" }}>
            {label}{" "}
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
              {selected.label}
            </span>
          </p>
          <p style={{ fontSize: "11.5px", color: "var(--text-tertiary)", marginTop: "4px" }}>{selected.caption}</p>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
        {EQUIVALENT_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            style={{
              width: selected.id === item.id ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: selected.id === item.id ? "var(--accent-primary)" : "var(--border-card)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.3s ease, background 0.2s ease",
            }}
          />
        ))}
      </div>

      {/* Selector chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {EQUIVALENT_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            style={
              selected.id === item.id
                ? {
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "6px 14px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 600,
                    background: "var(--accent-primary)",
                    color: "#FFFFFF",
                    border: "1px solid var(--accent-primary)",
                    cursor: "pointer",
                  }
                : {
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "6px 14px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 500,
                    background: "var(--bg-input)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-card)",
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
