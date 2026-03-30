"use client";

import { TrendingUp, Clock } from "lucide-react";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";

interface CostOfInactionProps {
  monthlyInterestCost: number;
  totalOverpayment: number;
  monthsInterestOnly: number;
}

export function CostOfInaction({
  monthlyInterestCost,
  totalOverpayment,
  monthsInterestOnly,
}: CostOfInactionProps) {
  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5 space-y-4">
      <p className="text-sm font-semibold text-[#92400e]">Стоимость текущего плана</p>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748b]">Проценты в месяц</p>
            <p className="text-lg font-bold text-[#0f172a]">{formatCurrency(monthlyInterestCost)}</p>
            <p className="text-xs text-[#94a3b8]">сейчас уходит только на обслуживание долга</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#64748b]">Итого переплата</p>
            <p className="text-lg font-bold text-[#0f172a]">{formatCurrency(totalOverpayment)}</p>
            <p className="text-xs text-[#94a3b8]">за {formatMonths(monthsInterestOnly)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
