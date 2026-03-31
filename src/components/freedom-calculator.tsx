"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";

interface Goal {
  id: string;
  label: string;
  emoji: string;
  monthlyAmount: number; // how much to save per month for this goal
  description: string;
}

const GOALS: Goal[] = [
  {
    id: "emergency",
    label: "Подушка безопасности",
    emoji: "🛡️",
    monthlyAmount: 1,    // all freed money
    description: "на 3 месяца расходов",
  },
  {
    id: "travel",
    label: "Путешествие",
    emoji: "✈️",
    monthlyAmount: 1,
    description: "за границу или по России",
  },
  {
    id: "car",
    label: "Автомобиль",
    emoji: "🚗",
    monthlyAmount: 1,
    description: "или первый взнос на него",
  },
  {
    id: "repair",
    label: "Ремонт",
    emoji: "🏠",
    monthlyAmount: 1,
    description: "в квартире или на даче",
  },
  {
    id: "education",
    label: "Обучение",
    emoji: "📚",
    monthlyAmount: 1,
    description: "курс, программа, книги",
  },
];

const SAVING_PERIODS = [
  { label: "6 мес.", months: 6 },
  { label: "1 год", months: 12 },
  { label: "2 года", months: 24 },
  { label: "3 года", months: 36 },
];

interface FreedomCalculatorProps {
  /** Monthly payment that will be freed after all debts closed */
  freedMonthlyPayment: number;
  /** Total months until debt-free */
  totalMonths: number;
}

export function FreedomCalculator({ freedMonthlyPayment, totalMonths }: FreedomCalculatorProps) {
  const [period, setPeriod] = useState(SAVING_PERIODS[1]); // 1 year default
  const [goal, setGoal] = useState(GOALS[0]);

  const accumulated = freedMonthlyPayment * period.months;

  return (
    <div className="rounded-2xl bg-white border border-[#E7ECF3] shadow-card p-5 space-y-4">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-[#0F172A]">После закрытия долгов</p>
        <p className="text-xs text-[#667085] mt-0.5">
          {formatCurrency(freedMonthlyPayment)}/мес освободится через {formatMonths(totalMonths)}
        </p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {SAVING_PERIODS.map((p) => (
          <button
            key={p.label}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
              period.label === p.label
                ? "bg-[#6C63FF] text-white shadow-sm"
                : "bg-[#F7F8FC] text-[#667085] border border-[#E7ECF3] hover:bg-[#EEF2FF] hover:text-[#6C63FF]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${period.label}-${goal.id}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF8] border border-[#C7D2FE] rounded-2xl px-5 py-5 text-center"
        >
          <p className="text-4xl mb-2">{goal.emoji}</p>
          <p className="font-numeric text-3xl font-bold text-[#0F172A] leading-none mb-1">
            {formatCurrency(accumulated)}
          </p>
          <p className="text-sm text-[#667085] mt-1">
            за {period.label} — это <span className="font-semibold text-[#6C63FF]">{goal.label.toLowerCase()}</span>
          </p>
          <p className="text-xs text-[#94a3b8] mt-0.5">{goal.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Goal selector chips */}
      <div className="flex flex-wrap gap-1.5">
        {GOALS.map((g) => (
          <button
            key={g.id}
            onClick={() => setGoal(g)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
              goal.id === g.id
                ? "bg-[#6C63FF] text-white shadow-sm"
                : "bg-[#F7F8FC] text-[#667085] border border-[#E7ECF3] hover:bg-[#EEF2FF] hover:text-[#6C63FF]"
            }`}
          >
            <span>{g.emoji}</span>
            {g.label}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-[#94a3b8]">
        Оценка — если откладывать высвободившийся платёж целиком без учёта инфляции и процентов.
      </p>
    </div>
  );
}
