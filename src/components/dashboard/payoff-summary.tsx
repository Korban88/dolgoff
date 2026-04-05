"use client";

import { MetricCard } from "@/components/ui/metric-card";
import { DollarSign, Calendar, Percent, CreditCard } from "lucide-react";
import type { DebtInput } from "@/lib/debt-calculator";

interface PayoffSummaryProps {
  debts: DebtInput[];
  totalMinPayment: number;
}

export function PayoffSummary({ debts, totalMinPayment }: PayoffSummaryProps) {
  const totalBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const weightedRate =
    totalBalance > 0
      ? debts.reduce((sum, d) => sum + d.interestRate * d.currentBalance, 0) / totalBalance
      : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up stagger-2">
      <MetricCard
        value={totalBalance}
        label="Общий долг"
        format="currency"
        icon={DollarSign}
      />
      <MetricCard
        value={totalMinPayment}
        label="Платёж в месяц"
        format="currency"
        icon={Calendar}
      />
      <MetricCard
        value={weightedRate}
        label="Взвеш. ставка"
        format="percent"
        animate={false}
        sublabel="средняя по балансу"
        icon={Percent}
        variant="warning"
      />
      <MetricCard
        value={debts.length}
        format="number"
        label="Кредитов"
        animate={false}
        sublabel="активных"
        icon={CreditCard}
        variant="accent"
      />
    </div>
  );
}
