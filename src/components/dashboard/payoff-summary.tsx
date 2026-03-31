"use client";

import { MetricCard } from "@/components/ui/metric-card";
import type { DebtInput } from "@/lib/debt-calculator";

interface PayoffSummaryProps {
  debts: DebtInput[];
  totalMinPayment: number;
}

export function PayoffSummary({ debts, totalMinPayment }: PayoffSummaryProps) {
  const totalBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0);

  // Weighted average rate (by balance)
  const weightedRate =
    totalBalance > 0
      ? debts.reduce((sum, d) => sum + d.interestRate * d.currentBalance, 0) / totalBalance
      : 0;

  // Nearest closure date
  const nearestDebt = debts.reduce(
    (min, d) => (d.minimumPayment > (min?.minimumPayment ?? 0) ? d : min),
    debts[0]
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        value={totalBalance}
        label="Общий долг"
        format="currency"
        variant="default"
      />
      <MetricCard
        value={totalMinPayment}
        label="Платежи в месяц"
        format="currency"
        variant="default"
      />
      <MetricCard
        value={weightedRate}
        label="Взвеш. ставка"
        format="percent"
        variant="default"
        animate={false}
        sublabel="средняя по балансу"
      />
      <MetricCard
        value={debts.length}
        label="Кредитов"
        format="number"
        variant="default"
        animate={false}
        sublabel={nearestDebt ? `макс. платёж: ${nearestDebt.creditorName}` : undefined}
      />
    </div>
  );
}
