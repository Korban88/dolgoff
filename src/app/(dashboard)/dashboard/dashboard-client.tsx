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

  // Base plan: avalanche, no extra
  const result = useMemo(() => calculatePayoff(debts, "avalanche", 0), [debts]);

  // Smart presets based on total min payment
  const totalMinPayment = useMemo(() => debts.reduce((s, d) => s + d.minimumPayment, 0), [debts]);
  const presets = useMemo(() => getSmartPresets(totalMinPayment), [totalMinPayment]);

  // Calculate scenario results for each preset
  const scenarioResults = useMemo(() => {
    const map: Record<number, ReturnType<typeof calculatePayoff>> = {};
    for (const amount of presets) {
      map[amount] = calculatePayoff(debts, "avalanche", amount);
    }
    return map;
  }, [debts, presets]);

  // Best preset result for chart comparison
  const bestPreset = presets[1] ?? presets[0];
  const bestResult = scenarioResults[bestPreset];

  // Payoff dates per debt
  const payoffDates = useMemo(() => getDebtPayoffDates(result), [result]);

  // Payoff date for the whole plan
  const payoffDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + result.totalMonths, 1);
  }, [result]);

  // Inaction cost
  const inactionCost = useMemo(() => calculateInactionCost(debts, result), [debts, result]);

  if (debts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Дашборд</h1>
            <p className="text-sm text-[#64748b] mt-0.5">Полная картина ваших долгов</p>
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-[#e2e8f0] p-12 text-center">
          <p className="text-lg font-semibold text-[#0f172a] mb-2">Добавьте первый долг</p>
          <p className="text-sm text-[#64748b] mb-6">
            Введите данные кредита — и увидите полную картину
          </p>
          <Button
            render={<Link href="/debts/new" />}
            className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            + Новый долг
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Дашборд</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Полная картина ваших долгов</p>
        </div>
        <Button
          render={<Link href="/debts/new" />}
          className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-200 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-1.5" />+ Новый долг
        </Button>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Left column */}
        <div className="space-y-6">
          <DashboardHero result={result} payoffDate={payoffDate} />
          <ScenarioCards
            presets={presets}
            baseResult={result}
            scenarioResults={scenarioResults}
          />
          <DebtProgressList debts={debts} payoffDates={payoffDates} />
        </div>

        {/* Right column — sticky */}
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
        </div>
      </div>

      {/* Action bar */}
      <div className="border-t border-[#e8edf4] pt-6 pb-2 mt-8">
        <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">
          Что дальше
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            render={<Link href="/simulator" />}
            className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-100 transition-all duration-200"
          >
            <Sliders className="w-4 h-4 mr-1.5" />
            Симулятор
          </Button>
          <Button
            render={<Link href="/debts/new" />}
            variant="outline"
            className="border-[#e2e8f0] text-[#64748b] rounded-xl hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            + Новый долг
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
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
