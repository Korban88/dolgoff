"use client";

import Link from "next/link";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import type { PayoffResult } from "@/lib/debt-calculator";
import { ArrowRight, TrendingDown } from "lucide-react";

interface ScenarioCardsProps {
  presets: number[];
  baseResult: PayoffResult;
  scenarioResults: Record<number, PayoffResult>;
}

export function ScenarioCards({ presets, baseResult, scenarioResults }: ScenarioCardsProps) {
  return (
    <div id="scenario-cards" className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#0F172A]">Сценарии доплат</p>
        <Link
          href="/simulator"
          className="text-xs font-medium text-[#6C63FF] hover:underline flex items-center gap-1"
        >
          Настроить свой <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {presets.map((amount, idx) => {
          const result = scenarioResults[amount];
          if (!result) return null;
          const savedMonths = baseResult.totalMonths - result.totalMonths;
          const savedMoney = baseResult.totalInterestPaid - result.totalInterestPaid;
          const isHighlight = idx === 1;

          return (
            <Link
              key={amount}
              href={`/simulator?extra=${amount}`}
              className={`group relative rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md block ${
                isHighlight
                  ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/25"
                  : "bg-white border border-[#E7ECF3] hover:border-[#6C63FF]/30 shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
              }`}
            >
              {isHighlight && (
                <span className="absolute -top-2.5 left-4 text-[10px] font-bold bg-[#12B76A] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Лучший старт
                </span>
              )}
              <p className={`text-xs font-semibold mb-2.5 ${isHighlight ? "text-white/70" : "text-[#6C63FF]"}`}>
                +{formatCurrency(amount)}/мес
              </p>
              {savedMonths > 0 && (
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown className={`w-3.5 h-3.5 ${isHighlight ? "text-white/80" : "text-[#12B76A]"}`} />
                  <p className={`text-base font-bold leading-none ${isHighlight ? "text-white" : "text-[#0F172A]"}`}>
                    −{formatMonths(savedMonths)}
                  </p>
                </div>
              )}
              {savedMoney > 0 && (
                <p className={`text-xs font-medium ${isHighlight ? "text-white/75" : "text-[#12B76A]"}`}>
                  экономия {formatCurrency(savedMoney)}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
