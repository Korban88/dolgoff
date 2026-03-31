"use client";

import Link from "next/link";
import { Target, Pencil } from "lucide-react";
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
  if (rate > 10) return "border-l-[#6C63FF]";
  return "border-l-emerald-400";
}

function getProgressColor(rate: number): string {
  if (rate > 30) return "from-orange-400 to-orange-500";
  if (rate > 20) return "from-amber-400 to-amber-500";
  if (rate > 10) return "from-[#6C63FF] to-[#5B8DEF]";
  return "from-emerald-400 to-emerald-500";
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
}

export function DebtProgressList({ debts, payoffDates }: DebtProgressListProps) {
  const sorted = [...debts].sort((a, b) => {
    const da = payoffDates[a.id]?.getTime() ?? Infinity;
    const db = payoffDates[b.id]?.getTime() ?? Infinity;
    return da - db;
  });

  const firstId = sorted[0]?.id;

  if (debts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E7ECF3] p-8 text-center">
        <p className="text-sm text-[#94a3b8]">Нет активных долгов</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#0F172A]">Долги</p>
      {sorted.map((debt) => {
        const progress =
          debt.originalBalance && debt.originalBalance > 0
            ? Math.max(0, Math.min(100, ((debt.originalBalance - debt.currentBalance) / debt.originalBalance) * 100))
            : 0;
        const isFirst = debt.id === firstId;
        const payoffDate = payoffDates[debt.id];

        return (
          <div
            key={debt.id}
            className={`rounded-2xl bg-white border border-[#E7ECF3] border-l-4 ${getBorderColor(debt.interestRate)} p-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)] hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-sm font-semibold text-[#0F172A] truncate">
                    {debt.creditorName}
                  </span>
                  {isFirst && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#12B76A] bg-[#F0FDF8] border border-[#BBF7D0] rounded-full px-2 py-0.5">
                      <Target className="w-2.5 h-2.5" />
                      Закроется первым
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#667085]">
                  {debt.interestRate}% год · мин. {formatCurrency(debt.minimumPayment)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#0F172A]">{formatCurrency(debt.currentBalance)}</p>
                  {payoffDate && (
                    <p className="text-[10px] text-[#94a3b8]">до {formatShortDate(payoffDate)}</p>
                  )}
                </div>
                <Link
                  href={`/debts/${debt.id}/edit`}
                  className="w-7 h-7 rounded-lg bg-[#F7F8FC] flex items-center justify-center text-[#667085] hover:bg-[#EEF2FF] hover:text-[#6C63FF] transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {debt.originalBalance && (
              <div>
                <div className="flex justify-between text-[10px] text-[#94a3b8] mb-1">
                  <span>Погашено</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(debt.interestRate)} rounded-full transition-all duration-700`}
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
