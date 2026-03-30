"use client";

import { Target } from "lucide-react";
import { formatCurrency } from "@/lib/debt-calculator";
import type { DebtInput } from "@/lib/debt-calculator";

interface DebtWithOriginal extends DebtInput {
  originalBalance?: number;
}

interface DebtProgressListProps {
  debts: DebtWithOriginal[];
  payoffDates: Record<string, Date>;
}

function getBorderColor(rate: number): string {
  if (rate > 30) return "border-l-orange-400";
  if (rate > 20) return "border-l-amber-400";
  if (rate > 10) return "border-l-blue-400";
  return "border-l-emerald-400";
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
}

export function DebtProgressList({ debts, payoffDates }: DebtProgressListProps) {
  // Sort by closure date ascending (earliest first)
  const sorted = [...debts].sort((a, b) => {
    const da = payoffDates[a.id]?.getTime() ?? Infinity;
    const db = payoffDates[b.id]?.getTime() ?? Infinity;
    return da - db;
  });

  const firstId = sorted[0]?.id;

  if (debts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#e2e8f0] p-8 text-center">
        <p className="text-sm text-[#94a3b8]">Нет активных долгов</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#0f172a]">Долги</p>
      {sorted.map((debt) => {
        const progress = debt.originalBalance
          ? Math.max(0, Math.min(100, ((debt.originalBalance - debt.currentBalance) / debt.originalBalance) * 100))
          : 0;
        const isFirst = debt.id === firstId;
        const payoffDate = payoffDates[debt.id];

        return (
          <div
            key={debt.id}
            className={`rounded-2xl bg-white border border-[#e2e8f0] border-l-4 ${getBorderColor(debt.interestRate)} p-4`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#0f172a]">{debt.creditorName}</span>
                  {isFirst && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#059669] bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
                      <Target className="w-3 h-3" />
                      Закроется первым
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#64748b] mt-0.5">{debt.interestRate}% годовых</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-[#0f172a]">{formatCurrency(debt.currentBalance)}</p>
                {payoffDate && (
                  <p className="text-xs text-[#94a3b8]">до {formatShortDate(payoffDate)}</p>
                )}
              </div>
            </div>

            {debt.originalBalance && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
                  <span>Прогресс</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
