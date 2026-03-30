"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { formatCurrency } from "@/lib/debt-calculator";
import type { PayoffResult } from "@/lib/debt-calculator";

interface DashboardHeroProps {
  result: PayoffResult;
  payoffDate: Date;
}

function formatPayoffDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

export function DashboardHero({ result, payoffDate }: DashboardHeroProps) {
  const savings = result.totalInterestPaid;

  return (
    <div className="space-y-4">
      {/* Primary hero — payoff date */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-6 text-white shadow-lg shadow-blue-100">
        <p className="text-sm font-medium text-blue-200 mb-1">Закроешь долги к</p>
        <p className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          {formatPayoffDate(payoffDate)}
        </p>
        <p className="text-sm text-blue-200 mt-3">
          {result.totalMonths} мес. при минимальных платежах
        </p>
      </div>

      {/* Overpayment — warning */}
      <MetricCard
        value={savings}
        label="Уйдёт на проценты"
        format="currency"
        variant="warning"
        className="w-full"
      />

      {/* CTA to scenarios */}
      <button
        onClick={() => {
          document.getElementById("scenario-cards")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="w-full text-sm font-semibold text-[#1e40af] bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl px-4 py-3 transition-colors text-center"
      >
        Посмотреть сценарии погашения ↓
      </button>
    </div>
  );
}
