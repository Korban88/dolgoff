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
    <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-5 space-y-4">
      <p className="text-xs font-semibold text-[#92400e] uppercase tracking-wide">
        Стоимость текущего плана
      </p>

      <div className="space-y-3.5">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#F79009]/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-[#F79009]" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-[#92400e]/70 uppercase tracking-wider">Проценты в месяц</p>
            <p className="text-lg font-bold text-[#0F172A] leading-tight">{formatCurrency(monthlyInterestCost)}</p>
          </div>
        </div>

        <div className="h-px bg-[#FDE68A]" />

        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#F79009]/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-[#F79009]" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-[#92400e]/70 uppercase tracking-wider">Итого переплата</p>
            <p className="text-lg font-bold text-[#0F172A] leading-tight">{formatCurrency(totalOverpayment)}</p>
            <p className="text-xs text-[#92400e]/60">за {formatMonths(monthsInterestOnly)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
