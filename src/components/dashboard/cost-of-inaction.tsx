"use client";

import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import { TrendingDown } from "lucide-react";

interface CostOfInactionProps {
  monthlyInterestCost: number;
  totalOverpayment: number;
  monthsInterestOnly: number;
}

export function CostOfInaction({ monthlyInterestCost, totalOverpayment, monthsInterestOnly }: CostOfInactionProps) {
  return (
    <div
      className="rounded-[18px] p-5"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: "var(--color-warning-light)" }}
        >
          <TrendingDown className="w-4 h-4" style={{ color: "var(--color-warning)", strokeWidth: 1.75 }} />
        </div>
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.05em]"
          style={{ color: "var(--text-tertiary)" }}
        >
          Стоимость текущего плана
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="metric-label mb-2">Проценты в месяц</p>
          <p
            className="text-[22px] font-bold tabular-nums"
            style={{ letterSpacing: "-0.025em", color: "var(--text-primary)" }}
          >
            {formatCurrency(monthlyInterestCost)}
          </p>
        </div>
        <div>
          <p className="metric-label mb-2">Итого переплата</p>
          <p
            className="text-[22px] font-bold tabular-nums"
            style={{ letterSpacing: "-0.025em", color: "var(--color-warning)" }}
          >
            {formatCurrency(totalOverpayment)}
          </p>
          <p className="text-[12px] mt-1" style={{ color: "var(--text-tertiary)" }}>
            за {formatMonths(monthsInterestOnly)}
          </p>
        </div>
      </div>
    </div>
  );
}
