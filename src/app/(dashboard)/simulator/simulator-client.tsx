"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculatePayoff,
  formatCurrency,
  formatMonths,
  type DebtInput,
  type Strategy,
} from "@/lib/debt-calculator";

interface Props {
  debts: DebtInput[];
}

const STRATEGIES: { value: Strategy; label: string }[] = [
  { value: "avalanche", label: "Лавина (дорогой сначала)" },
  { value: "snowball", label: "Снежный ком (маленький сначала)" },
  { value: "proportional", label: "Пропорционально" },
];

export function SimulatorClient({ debts }: Props) {
  const [extra, setExtra] = useState(0);
  const [strategy, setStrategy] = useState<Strategy>("avalanche");

  const baseline = useMemo(() => calculatePayoff(debts, strategy, 0), [debts, strategy]);
  const improved = useMemo(() => calculatePayoff(debts, strategy, extra), [debts, strategy, extra]);

  const savedMonths = baseline.totalMonths - improved.totalMonths;
  const savedMoney = baseline.totalInterestPaid - improved.totalInterestPaid;

  // Build chart data
  const chartData = useMemo(() => {
    const maxMonth = Math.max(baseline.totalMonths, improved.totalMonths);
    const step = Math.max(1, Math.floor(maxMonth / 60));

    const baseMap = new Map(baseline.schedule.map((s) => [s.month, s.totalBalance]));
    const improvedMap = new Map(improved.schedule.map((s) => [s.month, s.totalBalance]));

    const months: number[] = [];
    for (let m = 1; m <= maxMonth; m += step) months.push(m);
    if (months[months.length - 1] !== maxMonth) months.push(maxMonth);

    return months.map((m) => ({
      month: m,
      baseline: baseMap.get(m) ?? 0,
      improved: improvedMap.get(m) ?? 0,
    }));
  }, [baseline, improved]);

  // Order of payoff with extra
  const payoffOrder = improved.debtClosures;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Симулятор «Что если»</h1>

      {/* Extra payment slider */}
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-base text-[#0f172a]">Дополнительный платёж сверх минимума</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#64748b]">0 ₽</span>
            <span className="text-2xl font-bold text-[#1e40af]">{formatCurrency(extra)}</span>
            <span className="text-sm text-[#64748b]">50 000 ₽</span>
          </div>
          <input
            type="range"
            min={0}
            max={50000}
            step={1000}
            value={extra}
            onChange={(e) => setExtra(Number(e.target.value))}
            className="w-full accent-[#1e40af]"
          />
        </CardContent>
      </Card>

      {/* Strategy tabs */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#0f172a]">Стратегия погашения</p>
        <Tabs value={strategy} onValueChange={(v) => setStrategy(v as Strategy)}>
          <TabsList className="bg-[#f1f5f9]">
            {STRATEGIES.map((s) => (
              <TabsTrigger key={s.value} value={s.value} className="text-xs sm:text-sm">
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-[#e2e8f0]">
          <CardContent className="pt-5">
            <p className="text-sm text-[#64748b]">Новый срок погашения</p>
            <p className="text-2xl font-bold text-[#1e40af] mt-1">{formatMonths(improved.totalMonths)}</p>
            {savedMonths > 0 && (
              <p className="text-sm text-[#059669] mt-0.5">на {formatMonths(savedMonths)} быстрее</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="pt-5">
            <p className="text-sm text-[#64748b]">Переплата по процентам</p>
            <p className="text-2xl font-bold text-[#f59e0b] mt-1">{formatCurrency(improved.totalInterestPaid)}</p>
            {savedMoney > 0 && (
              <p className="text-sm text-[#059669] mt-0.5">экономия {formatCurrency(savedMoney)}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-base text-[#0f172a]">Сравнение планов погашения</CardTitle>
        </CardHeader>
        <CardContent>
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
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "baseline" ? "Только минимум" : "С доплатой",
                ]}
                labelFormatter={(label) => `Месяц ${label}`}
              />
              <Legend
                formatter={(value) => value === "baseline" ? "Только минимум" : "С доплатой"}
              />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                name="baseline"
              />
              <Line
                type="monotone"
                dataKey="improved"
                stroke="#1e40af"
                strokeWidth={2}
                dot={false}
                name="improved"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payoff order */}
      {payoffOrder.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-[#0f172a]">Порядок закрытия долгов</h2>
          <div className="space-y-2">
            {payoffOrder.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 bg-white border border-[#e2e8f0] rounded-lg px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-[#eff6ff] text-[#1e40af] text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-[#0f172a] text-sm font-medium">{c.creditorName}</span>
                <span className="text-sm text-[#64748b]">мес. {c.closedAtMonth}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-[#64748b] mt-4">
        Расчёт носит информационный характер и не является финансовой консультацией.
        Реальные суммы зависят от условий договора, комиссий и других факторов.
      </p>
    </div>
  );
}
