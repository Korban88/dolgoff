"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  calculatePayoff,
  getDebtPayoffDates,
  getSmartPresets,
  calculateInactionCost,
  type DebtInput,
} from "@/lib/debt-calculator";
import { Plus, Sliders, Share2 } from "lucide-react";
import { ShareModal } from "@/components/share-modal";
import { LifeEquivalents } from "@/components/life-equivalents";
import { FreedomCalculator } from "@/components/freedom-calculator";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { CostOfInaction } from "@/components/dashboard/cost-of-inaction";
import { ScenarioCards } from "@/components/dashboard/scenario-cards";
import { PayoffSummary } from "@/components/dashboard/payoff-summary";
import { DebtProgressList } from "@/components/dashboard/debt-progress-list";
import { PayoffChart } from "@/components/dashboard/payoff-chart";

interface DashboardDebt extends DebtInput {
  originalBalance?: number;
}

interface Props {
  debts: DashboardDebt[];
}

export function DashboardClient({ debts }: Props) {
  const [shareOpen, setShareOpen] = useState(false);

  const result = useMemo(() => calculatePayoff(debts, "avalanche", 0), [debts]);
  const totalMinPayment = useMemo(() => debts.reduce((s, d) => s + d.minimumPayment, 0), [debts]);
  const presets = useMemo(() => getSmartPresets(totalMinPayment), [totalMinPayment]);

  const scenarioResults = useMemo(() => {
    const map: Record<number, ReturnType<typeof calculatePayoff>> = {};
    for (const amount of presets) {
      map[amount] = calculatePayoff(debts, "avalanche", amount);
    }
    return map;
  }, [debts, presets]);

  const bestPreset = presets[1] ?? presets[0];
  const bestResult = scenarioResults[bestPreset];

  const payoffDates = useMemo(() => getDebtPayoffDates(result), [result]);

  const payoffDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + result.totalMonths, 1);
  }, [result]);

  const inactionCost = useMemo(() => calculateInactionCost(debts, result), [debts, result]);

  if (debts.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#EEF2FF] flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none">
            <circle cx="50" cy="50" r="42" stroke="url(#empty-ring)" strokeWidth="16" strokeLinecap="round" />
            <defs>
              <linearGradient id="empty-ring" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2DDACC" />
                <stop offset="50%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
            Добавьте первый долг
          </h1>
          <p className="text-[#667085]">
            Введите данные кредита — и увидите полную картину: когда закроете, сколько переплатите
          </p>
        </div>
        <Button
          render={<Link href="/debts/new" />}
          className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl px-8 h-11 font-semibold shadow-md shadow-[#6C63FF]/25 transition-all duration-200 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          + Новый долг
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Обзор</h1>
          <p className="text-sm text-[#667085] mt-0.5">Ваш план выхода из долгов</p>
        </div>
        <Button
          render={<Link href="/debts/new" />}
          className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl shadow-sm shadow-[#6C63FF]/20 transition-all duration-200 hover:scale-[1.02] text-sm font-semibold h-9 px-4"
        >
          <Plus className="w-4 h-4 mr-1" />+ Новый долг
        </Button>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Left */}
        <div className="space-y-5">
          <DashboardHero result={result} payoffDate={payoffDate} />
          <ScenarioCards
            presets={presets}
            baseResult={result}
            scenarioResults={scenarioResults}
          />
          <DebtProgressList debts={debts} payoffDates={payoffDates} />
        </div>

        {/* Right — sticky */}
        <div className="space-y-4 md:sticky md:top-6 self-start">
          <CostOfInaction
            monthlyInterestCost={inactionCost.monthlyInterestCost}
            totalOverpayment={inactionCost.totalOverpayment}
            monthsInterestOnly={inactionCost.monthsInterestOnly}
          />
          <PayoffSummary debts={debts} totalMinPayment={totalMinPayment} />
          <PayoffChart
            baseResult={result}
            bestResult={bestResult}
            bestExtra={bestPreset}
          />
          {result.totalInterestPaid > 1000 && (
            <LifeEquivalents
              amount={result.totalInterestPaid}
              label="переплата — это"
              title="Переплата в реальных деньгах"
            />
          )}
          <FreedomCalculator
            freedMonthlyPayment={totalMinPayment}
            totalMonths={result.totalMonths}
          />
        </div>
      </div>

      {/* Action bar */}
      <div className="border-t border-[#E7ECF3] pt-5 pb-2 mt-8">
        <div className="flex flex-wrap gap-2.5">
          <Button
            render={<Link href="/simulator" />}
            className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl shadow-sm shadow-[#6C63FF]/20 h-9 px-4 text-sm font-semibold transition-all duration-200"
          >
            <Sliders className="w-4 h-4 mr-1.5" />
            Симулятор
          </Button>
          <Button
            render={<Link href="/debts/new" />}
            variant="outline"
            className="border-[#E7ECF3] text-[#667085] rounded-xl hover:bg-[#F7F8FC] hover:text-[#0F172A] h-9 px-4 text-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            + Новый долг
          </Button>
          <Button
            variant="outline"
            className="border-[#E7ECF3] text-[#667085] rounded-xl hover:bg-[#F7F8FC] hover:text-[#0F172A] h-9 px-4 text-sm transition-colors"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            Поделиться
          </Button>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={{ type: "overview" }}
      />
    </div>
  );
}
