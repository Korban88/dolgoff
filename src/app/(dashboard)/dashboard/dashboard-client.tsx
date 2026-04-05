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

  const result        = useMemo(() => calculatePayoff(debts, "avalanche", 0), [debts]);
  const totalMinPayment = useMemo(() => debts.reduce((s, d) => s + d.minimumPayment, 0), [debts]);
  const presets       = useMemo(() => getSmartPresets(totalMinPayment), [totalMinPayment]);

  const scenarioResults = useMemo(() => {
    const map: Record<number, ReturnType<typeof calculatePayoff>> = {};
    for (const amount of presets) map[amount] = calculatePayoff(debts, "avalanche", amount);
    return map;
  }, [debts, presets]);

  const bestPreset   = presets[1] ?? presets[0];
  const bestResult   = scenarioResults[bestPreset];
  const payoffDates  = useMemo(() => getDebtPayoffDates(result), [result]);
  const payoffDate   = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + result.totalMonths, 1);
  }, [result]);
  const inactionCost = useMemo(() => calculateInactionCost(debts, result), [debts, result]);

  if (debts.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <div
          className="w-16 h-16 mx-auto rounded-[18px] flex items-center justify-center"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-card)" }}
        >
          <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
            <circle cx="20" cy="20" r="15" stroke="var(--border-default)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M20 13v7M20 24v.5" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-[22px] font-bold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
            Добавьте первый долг
          </h1>
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Введите данные кредита — и увидите полную картину: когда закроете, сколько переплатите
          </p>
        </div>
        <Button
          nativeButton={false} render={<Link href="/debts/new" />}
          className="h-11 px-8 rounded-[10px] text-[14px] font-semibold transition-all duration-200"
          style={{ background: "var(--accent-primary)", color: "#FFFFFF" }}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Добавить долг
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Обзор
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Ваш план погашения долгов
          </p>
        </div>
        <Button
          nativeButton={false} render={<Link href="/debts/new" />}
          className="h-9 px-4 rounded-[10px] text-[13px] font-semibold transition-all duration-200"
          style={{ background: "var(--accent-primary)", color: "#FFFFFF" }}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />+ Долг
        </Button>
      </div>

      {/* Single column layout */}
      <div className="space-y-6">
        <DashboardHero result={result} payoffDate={payoffDate} />
        <PayoffSummary debts={debts} totalMinPayment={totalMinPayment} />
        <ScenarioCards presets={presets} baseResult={result} scenarioResults={scenarioResults} />
        <DebtProgressList debts={debts} payoffDates={payoffDates} />
        <CostOfInaction
          monthlyInterestCost={inactionCost.monthlyInterestCost}
          totalOverpayment={inactionCost.totalOverpayment}
          monthsInterestOnly={inactionCost.monthsInterestOnly}
        />
        <PayoffChart baseResult={result} bestResult={bestResult} bestExtra={bestPreset} />
        {result.totalInterestPaid > 1000 && (
          <LifeEquivalents
            amount={result.totalInterestPaid}
            label="переплата — это"
            title="Ощутить переплату"
          />
        )}
        <FreedomCalculator freedMonthlyPayment={totalMinPayment} totalMonths={result.totalMonths} />
      </div>

      {/* Action bar */}
      <div
        className="flex flex-wrap gap-2 pt-5 mt-4"
        style={{ borderTop: "1px solid var(--border-light)" }}
      >
        <Button
          nativeButton={false} render={<Link href="/simulator" />}
          className="h-9 px-4 rounded-[10px] text-[13px] font-semibold transition-all duration-200"
          style={{ background: "var(--accent-primary)", color: "#FFFFFF" }}
        >
          <Sliders className="w-3.5 h-3.5 mr-1.5" style={{ strokeWidth: 1.75 }} />Симулятор
        </Button>
        <Button
          nativeButton={false} render={<Link href="/debts/new" />}
          className="h-9 px-4 rounded-[10px] text-[13px] font-medium transition-colors"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />+ Долг
        </Button>
        <Button
          className="h-9 px-4 rounded-[10px] text-[13px] font-medium transition-colors"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-default)",
          }}
          onClick={() => setShareOpen(true)}
        >
          <Share2 className="w-3.5 h-3.5 mr-1.5" style={{ strokeWidth: 1.75 }} />Поделиться
        </Button>
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} data={{ type: "overview" }} />
    </div>
  );
}
