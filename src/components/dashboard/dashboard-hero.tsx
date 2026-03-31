"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import type { PayoffResult } from "@/lib/debt-calculator";

interface DashboardHeroProps {
  result: PayoffResult;
  payoffDate: Date;
}

function formatPayoffDateLong(date: Date): string {
  return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

export function DashboardHero({ result, payoffDate }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6C63FF] via-[#7C73FF] to-[#5B8DEF] p-7 text-white shadow-lg shadow-[#6C63FF]/20">
      {/* Decorative ring */}
      <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full border-[28px] border-white/5 pointer-events-none" />
      <div className="absolute -right-2 bottom-0 w-32 h-32 rounded-full border-[18px] border-white/5 pointer-events-none" />

      {/* Label */}
      <p className="text-sm font-medium text-white/70 mb-3 tracking-wide">Закроешь долги к</p>

      {/* Primary date */}
      <p className="text-5xl sm:text-6xl font-bold leading-none tracking-tight mb-2">
        {formatPayoffDateLong(payoffDate)}
      </p>
      <p className="text-white/60 text-sm mb-6">
        {formatMonths(result.totalMonths)} при текущем плане
      </p>

      {/* Overpayment pill */}
      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 mb-6">
        <div className="w-2 h-2 rounded-full bg-[#F79009]" />
        <span className="text-sm font-medium text-white/90">
          Уйдёт на проценты: <span className="font-bold text-white">{formatCurrency(result.totalInterestPaid)}</span>
        </span>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Button
          render={<Link href="/simulator" />}
          className="bg-white text-[#6C63FF] hover:bg-white/90 font-semibold rounded-xl h-10 px-5 shadow-sm transition-all duration-200 hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4 mr-1.5" />
          Ускорить погашение
        </Button>
        <button
          onClick={() => {
            document.getElementById("scenario-cards")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white transition-colors"
        >
          Сценарии доплат
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
