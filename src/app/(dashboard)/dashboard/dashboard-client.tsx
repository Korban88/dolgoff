"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  calculatePayoff,
  compareStrategies,
  formatCurrency,
  formatMonths,
  type DebtInput,
} from "@/lib/debt-calculator";
import { Plus } from "lucide-react";

interface Props {
  debts: DebtInput[];
}

const STRATEGY_LABELS: Record<string, string> = {
  minimum: "Только минимум",
  avalanche: "Лавина",
  snowball: "Снежный ком",
  proportional: "Пропорционально",
};

export function DashboardClient({ debts }: Props) {
  const result = useMemo(() => calculatePayoff(debts, "avalanche", 0), [debts]);
  const comparison = useMemo(() => compareStrategies(debts, 0), [debts]);

  const totalBalance = debts.reduce((s, d) => s + d.currentBalance, 0);
  const totalMinPayment = debts.reduce((s, d) => s + d.minimumPayment, 0);

  const overpayPercent = totalBalance > 0
    ? Math.round((result.totalInterestPaid / totalBalance) * 100)
    : 0;

  // Build chart data — show every 3 months, max 100 points
  const chartData = useMemo(() => {
    const step = Math.max(1, Math.floor(result.schedule.length / 60));
    return result.schedule
      .filter((_, i) => i % step === 0 || i === result.schedule.length - 1)
      .map((s) => ({
        month: s.month,
        balance: Math.round(s.totalBalance),
      }));
  }, [result]);

  const closureMonths = result.debtClosures.map((c) => c.closedAtMonth);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0f172a]">Дашборд</h1>
        <Button render={<Link href="/debts/new" />} size="sm" className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white">
          <Plus className="w-4 h-4 mr-1" />Добавить долг
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[#e2e8f0]">
          <CardContent className="pt-5">
            <p className="text-sm text-[#64748b]">Общий долг</p>
            <p className="text-2xl font-bold text-[#0f172a] mt-1">{formatCurrency(totalBalance)}</p>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="pt-5">
            <p className="text-sm text-[#64748b]">Мин. платёж / мес</p>
            <p className="text-2xl font-bold text-[#0f172a] mt-1">{formatCurrency(totalMinPayment)}</p>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="pt-5">
            <p className="text-sm text-[#64748b]">Срок погашения</p>
            <p className="text-2xl font-bold text-[#1e40af] mt-1">{formatMonths(result.totalMonths)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Overpayment */}
      <Card className="border-[#e2e8f0] bg-[#fef3c7]">
        <CardContent className="pt-5">
          <p className="text-sm text-[#92400e]">Переплата по процентам</p>
          <p className="text-3xl font-bold text-[#92400e] mt-1">{formatCurrency(result.totalInterestPaid)}</p>
          <p className="text-sm text-[#b45309] mt-1">это {overpayPercent}% от текущего долга</p>
        </CardContent>
      </Card>

      {/* Debts list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[#0f172a]">Долги по убыванию ставки</h2>
        {debts.map((debt) => (
          <Card key={debt.id} className="border-[#e2e8f0]">
            <CardContent className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#0f172a]">{debt.creditorName}</span>
                    <Badge variant="secondary" className="text-xs bg-[#eff6ff] text-[#1e40af]">{debt.debtType}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-[#64748b] mt-0.5">
                    <span>{formatCurrency(debt.currentBalance)}</span>
                    <span>{debt.interestRate}% год.</span>
                    <span>мин. {formatCurrency(debt.minimumPayment)}</span>
                  </div>
                </div>
                <Link href={`/debts/${debt.id}/edit`} className="text-xs text-[#64748b] hover:text-[#1e40af]">
                  Изменить
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strategy comparison */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[#0f172a]">Сравнение стратегий</h2>
        <p className="text-xs text-[#64748b]">Расчёт на основе только минимальных платежей без доплат</p>
        <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="text-left px-4 py-3 font-medium text-[#64748b]">Стратегия</th>
                <th className="text-right px-4 py-3 font-medium text-[#64748b]">Срок</th>
                <th className="text-right px-4 py-3 font-medium text-[#64748b]">Переплата</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(comparison).map(([key, val]) => (
                <tr key={key} className="border-b border-[#e2e8f0] last:border-0">
                  <td className="px-4 py-3 text-[#0f172a]">{STRATEGY_LABELS[key]}</td>
                  <td className="px-4 py-3 text-right text-[#0f172a]">{formatMonths(val.totalMonths)}</td>
                  <td className="px-4 py-3 text-right text-[#f59e0b] font-medium">{formatCurrency(val.totalInterestPaid)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[#64748b]">
          Расчёт носит информационный характер и не является финансовой консультацией.
        </p>
      </div>

      {/* Payoff chart */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-[#0f172a]">График погашения</h2>
        <Card className="border-[#e2e8f0]">
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  label={{ value: "Месяц", position: "insideBottom", offset: -2, fontSize: 11, fill: "#64748b" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Остаток"]}
                  labelFormatter={(label) => `Месяц ${label}`}
                />
                <Legend />
                {closureMonths.map((m) => (
                  <ReferenceLine key={m} x={m} stroke="#059669" strokeDasharray="4 2" />
                ))}
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#1e40af"
                  strokeWidth={2}
                  dot={false}
                  name="Остаток долга"
                />
              </LineChart>
            </ResponsiveContainer>
            {result.debtClosures.length > 0 && (
              <p className="text-xs text-[#64748b] mt-2">
                Зелёные линии — закрытие долгов:{" "}
                {result.debtClosures.map((c) => `${c.creditorName} (мес. ${c.closedAtMonth})`).join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
