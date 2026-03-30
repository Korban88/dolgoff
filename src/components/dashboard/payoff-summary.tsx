"use client";

import { MetricCard } from "@/components/ui/metric-card";
import type { DebtInput } from "@/lib/debt-calculator";

interface PayoffSummaryProps {
  debts: DebtInput[];
  totalMinPayment: number;
}

export function PayoffSummary({ debts, totalMinPayment }: PayoffSummaryProps) {
  const totalBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const avgRate =
    debts.length > 0
      ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length
      : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
        value={avgRate}
        label="Средняя ставка"
        format="percent"
        variant="default"
        animate={false}
        className="col-span-2 md:col-span-1"
      />
    </div>
  );
}
