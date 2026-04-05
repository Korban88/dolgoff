"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";

interface Goal {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const GOALS: Goal[] = [
  { id: "emergency", label: "Подушка безопасности", emoji: "🛡️", description: "на 3 месяца расходов" },
  { id: "travel",    label: "Путешествие",          emoji: "✈️", description: "за границу или по России" },
  { id: "car",       label: "Автомобиль",            emoji: "🚗", description: "или первый взнос на него" },
  { id: "repair",    label: "Ремонт",                emoji: "🏠", description: "в квартире или на даче" },
  { id: "education", label: "Обучение",              emoji: "📚", description: "курс, программа, книги" },
];

const SAVING_PERIODS = [
  { label: "6 мес.", months: 6 },
  { label: "1 год",  months: 12 },
  { label: "2 года", months: 24 },
  { label: "3 года", months: 36 },
];

interface FreedomCalculatorProps {
  freedMonthlyPayment: number;
  totalMonths: number;
}

export function FreedomCalculator({ freedMonthlyPayment, totalMonths }: FreedomCalculatorProps) {
  const [period, setPeriod] = useState(SAVING_PERIODS[1]);
  const [goal, setGoal] = useState(GOALS[0]);

  const accumulated = freedMonthlyPayment * period.months;

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
      <div>
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>После закрытия долгов</p>
        <p style={{ fontSize: "12px", marginTop: "4px", color: "#555555" }}>
          {formatCurrency(freedMonthlyPayment)}/мес освободится через {formatMonths(totalMonths)}
        </p>
      </div>

      {/* Period selector */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {SAVING_PERIODS.map((p) => (
          <button
            key={p.label}
            onClick={() => setPeriod(p)}
            style={
              period.label === p.label
                ? {
                    padding: "6px 16px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 600,
                    background: "#B5F562", color: "#0A0A0A",
                    border: "1px solid #B5F562", cursor: "pointer",
                  }
                : {
                    padding: "6px 16px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 500,
                    background: "var(--surface-elevated)", color: "#8A8A8A",
                    border: "1px solid var(--border-subtle)", cursor: "pointer",
                  }
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${period.label}-${goal.id}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: "var(--surface-elevated)",
            borderRadius: "12px",
            padding: "28px 20px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "48px", lineHeight: 1, marginBottom: "12px" }}>{goal.emoji}</p>
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
            {formatCurrency(accumulated)}
          </p>
          <p style={{ fontSize: "13px", color: "#555555", marginTop: "8px" }}>
            за {period.label} — это{" "}
            <span style={{ fontWeight: 600, color: "#8A8A8A" }}>
              {goal.label.toLowerCase()}
            </span>
          </p>
          <p style={{ fontSize: "11.5px", color: "#555555", marginTop: "4px" }}>{goal.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Goal selector chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGoal(g)}
            style={
              goal.id === g.id
                ? {
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "6px 16px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 600,
                    background: "#B5F562", color: "#0A0A0A",
                    border: "1px solid #B5F562", cursor: "pointer",
                  }
                : {
                    display: "flex", alignItems: "center", gap: "4px",
                    padding: "6px 16px", borderRadius: "20px",
                    fontSize: "12px", fontWeight: 500,
                    background: "var(--surface-elevated)", color: "#8A8A8A",
                    border: "1px solid var(--border-subtle)", cursor: "pointer",
                  }
            }
          >
            <span>{g.emoji}</span>
            {g.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: "10.5px", color: "#555555" }}>
        Оценка — если откладывать высвободившийся платёж целиком без учёта инфляции и процентов.
      </p>
    </div>
  );
}
