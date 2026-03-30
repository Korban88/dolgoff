"use client";

import Link from "next/link";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import type { PayoffResult } from "@/lib/debt-calculator";
import { ArrowRight } from "lucide-react";

interface ScenarioCardsProps {
  presets: number[];
  baseResult: PayoffResult;
  scenarioResults: Record<number, PayoffResult>;
}

export function ScenarioCards({ presets, baseResult, scenarioResults }: ScenarioCardsProps) {
  return (
    <div id="scenario-cards" className="space-y-3">
      <p className="text-sm font-semibold text-[#0f172a]">Что изменится с доплатой</p>
      <div className="grid grid-cols-2 gap-3">
        {presets.map((amount) => {
          const result = scenarioResults[amount];
          if (!result) return null;
          const savedMonths = baseResult.totalMonths - result.totalMonths;
          const savedMoney = baseResult.totalInterestPaid - result.totalInterestPaid;
          return (
            <Link
              key={amount}
              href={`/simulator?extra=${amount}`}
              className="group rounded-2xl bg-white border border-[#e2e8f0] p-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.02] block"
            >
              <p className="text-xs font-semibold text-[#1e40af] mb-2">
                +{formatCurrency(amount)}/мес
              </p>
              {savedMonths > 0 && (
                <p className="text-sm font-bold text-[#059669]">
                  −{formatMonths(savedMonths)}
                </p>
              )}
              {savedMoney > 0 && (
                <p className="text-xs text-[#059669]">
                  экономия {formatCurrency(savedMoney)}
                </p>
              )}
              <p className="text-xs text-[#94a3b8] mt-1 group-hover:text-[#64748b] transition-colors">
                подробнее →
              </p>
            </Link>
          );
        })}

        {/* Custom scenario card */}
        <Link
          href="/simulator"
          className="group rounded-2xl bg-blue-50 border border-blue-100 p-4 hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between"
        >
          <p className="text-xs font-semibold text-[#1e40af] mb-2">Свой вариант</p>
          <div className="flex items-center gap-1 text-[#1e40af]">
            <span className="text-sm font-bold">Открыть симулятор</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
