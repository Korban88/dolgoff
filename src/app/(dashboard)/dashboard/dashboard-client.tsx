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
import { Plus, Wallet, CalendarCheck, CreditCard, TrendingDown, Pencil, Trophy } from "lucide-react";

interface Props {
  debts: DebtInput[];
}

const STRATEGY_LABELS: Record<string, string> = {
  minimum: "Только минимум",
  avalanche: "Лавина",
  snowball: "Снежный ком",
  proportional: "Пропорционально",
};

const DEBT_TYPE_COLORS: Record<string, string> = {
  "Ипотека": "bg-blue-100 text-blue-700",
  "Автокредит": "bg-violet-100 text-violet-700",
  "Кредит наличными": "bg-sky-100 text-sky-700",
  "Кредитная карта": "bg-indigo-100 text-indigo-700",
  "Рассрочка": "bg-teal-100 text-teal-700",
  "МФО": "bg-orange-100 text-orange-700",
  "Другое": "bg-slate-100 text-slate-600",
};

export function DashboardClient({ debts }: Props) {
  const result = useMemo(() => calculatePayoff(debts, "avalanche", 0), [debts]);
  const comparison = useMemo(() => compareStrategies(debts, 0), [debts]);

  const totalBalance = debts.reduce((s, d) => s + d.currentBalance, 0);
  const totalMinPayment = debts.reduce((s, d) => s + d.minimumPayment, 0);

  const overpayPercent = totalBalance > 0
    ? Math.round((result.totalInterestPaid / totalBalance) * 100)
    : 0;

  // Find best strategy (minimum interest paid)
  const bestStrategyKey = Object.entries(comparison).reduce(
    (best, [key, val]) => (key !== "minimum" && val.totalInterestPaid < comparison[best as keyof typeof comparison].totalInterestPaid ? key : best),
    "avalanche"
  );

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
    <div className="max-w-4xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Дашборд</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Полная картина ваших долгов</p>
        </div>
        <Button render={<Link href="/debts/new" />} className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-200 transition-all duration-200">
          <Plus className="w-4 h-4 mr-1.5" />Добавить долг
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748b] font-medium">Общий долг</p>
                <p className="text-2xl font-bold text-[#0f172a] mt-1.5">{formatCurrency(totalBalance)}</p>
                <p className="text-xs text-[#94a3b8] mt-1">{debts.length} {debts.length === 1 ? "кредит" : debts.length < 5 ? "кредита" : "кредитов"}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-[#1e40af]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748b] font-medium">Мин. платёж / мес</p>
                <p className="text-2xl font-bold text-[#0f172a] mt-1.5">{formatCurrency(totalMinPayment)}</p>
                <p className="text-xs text-[#94a3b8] mt-1">суммарно по всем</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-[#475569]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748b] font-medium">Срок погашения</p>
                <p className="text-2xl font-bold text-[#1e40af] mt-1.5">{formatMonths(result.totalMonths)}</p>
                <p className="text-xs text-[#94a3b8] mt-1">при текущем плане</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 h-5 text-[#059669]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overpayment */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-gradient-to-r from-[#fffbeb] to-[#fef9ec]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[#92400e] font-medium">Переплата по процентам</p>
              <p className="text-3xl font-bold text-[#78350f] mt-1.5">{formatCurrency(result.totalInterestPaid)}</p>
              <p className="text-sm text-[#b45309] mt-1">это <strong>{overpayPercent}%</strong> от текущего долга</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <TrendingDown className="w-6 h-6 text-[#b45309]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debts list */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#0f172a]">Долги по убыванию ставки</h2>
        {debts.map((debt) => {
          const badgeClass = DEBT_TYPE_COLORS[debt.debtType] ?? "bg-slate-100 text-slate-600";
          return (
            <Card key={debt.id} className="border-0 shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow duration-200">
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#0f172a] truncate">{debt.creditorName}</span>
                      <Badge className={`text-xs shrink-0 border-0 ${badgeClass}`}>
                        {debt.debtType}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-[#0f172a] font-medium">{formatCurrency(debt.currentBalance)}</span>
                      <span className="text-[#64748b]">{debt.interestRate}% год.</span>
                      <span className="text-[#64748b]">мин. {formatCurrency(debt.minimumPayment)}</span>
                    </div>
                  </div>
                  <Link
                    href={`/debts/${debt.id}/edit`}
                    className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#1e40af] transition-colors shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Strategy comparison */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-[#0f172a]">Сравнение стратегий</h2>
          <p className="text-xs text-[#64748b] mt-0.5">При только минимальных платежах, без доплат</p>
        </div>
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e8edf4]">
                  <th className="text-left px-5 py-3.5 font-semibold text-[#64748b]">Стратегия</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-[#64748b]">Срок</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-[#64748b]">Переплата</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(comparison).map(([key, val]) => {
                  const isBest = key === bestStrategyKey;
                  return (
                    <tr key={key} className={`border-b border-[#e8edf4] last:border-0 transition-colors ${isBest ? "bg-[#f0fdf4]" : "hover:bg-[#f8fafc]"}`}>
                      <td className="px-5 py-3.5 font-medium text-[#0f172a]">
                        <div className="flex items-center gap-2">
                          {isBest && <Trophy className="w-3.5 h-3.5 text-[#059669]" />}
                          {STRATEGY_LABELS[key]}
                          {isBest && <span className="text-xs text-[#059669] font-semibold bg-emerald-100 px-1.5 py-0.5 rounded-full">выгоднее</span>}
                        </div>
                      </td>
                      <td className={`px-5 py-3.5 text-right font-medium ${isBest ? "text-[#059669]" : "text-[#0f172a]"}`}>
                        {formatMonths(val.totalMonths)}
                      </td>
                      <td className={`px-5 py-3.5 text-right font-semibold ${isBest ? "text-[#059669]" : "text-[#f59e0b]"}`}>
                        {formatCurrency(val.totalInterestPaid)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="text-xs text-[#94a3b8]">
          Расчёт носит информационный характер и не является финансовой консультацией.
        </p>
      </div>

      {/* Payoff chart */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#0f172a]">График погашения</h2>
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="pt-5 pb-4">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  label={{ value: "Месяц", position: "insideBottom", offset: -2, fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e8edf4", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  formatter={(value) => [formatCurrency(Number(value)), "Остаток"]}
                  labelFormatter={(label) => `Месяц ${label}`}
                />
                <Legend />
                {closureMonths.map((m) => (
                  <ReferenceLine key={m} x={m} stroke="#059669" strokeDasharray="4 2" strokeOpacity={0.7} />
                ))}
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#1e40af"
                  strokeWidth={2.5}
                  dot={false}
                  name="Остаток долга"
                />
              </LineChart>
            </ResponsiveContainer>
            {result.debtClosures.length > 0 && (
              <p className="text-xs text-[#94a3b8] mt-2 px-1">
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
