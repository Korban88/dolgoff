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
import { TrendingDown, Clock, PiggyBank, CheckCircle2 } from "lucide-react";

interface Props {
  debts: DebtInput[];
}

const STRATEGIES: { value: Strategy; label: string }[] = [
  { value: "avalanche", label: "Лавина" },
  { value: "snowball", label: "Снежный ком" },
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
    <div className="max-w-4xl mx-auto space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Симулятор «Что если»</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Узнайте, как доплата меняет всю картину</p>
      </div>

      {/* Extra payment slider */}
      <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-[#0f172a] mb-1">Дополнительный платёж сверх минимума</p>
            <p className="text-xs text-[#94a3b8]">Двигайте ползунок, чтобы увидеть эффект</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-[#94a3b8] shrink-0">0 ₽</span>
            <div className="text-center">
              <span className="text-3xl font-bold text-[#1e40af]">{formatCurrency(extra)}</span>
              <p className="text-xs text-[#94a3b8] mt-0.5">в месяц</p>
            </div>
            <span className="text-sm text-[#94a3b8] shrink-0">50 000 ₽</span>
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={extra}
              onChange={(e) => setExtra(Number(e.target.value))}
              className="w-full h-2 appearance-none rounded-full cursor-pointer accent-[#1e40af]"
              style={{
                background: `linear-gradient(to right, #1e40af ${(extra / 50000) * 100}%, #e2e8f0 ${(extra / 50000) * 100}%)`,
              }}
            />
            <div className="flex justify-between text-xs text-[#cbd5e1] mt-2">
              {[0, 10000, 20000, 30000, 40000, 50000].map((v) => (
                <span key={v}>{v === 0 ? "0" : `${v / 1000}k`}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy tabs */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#0f172a]">Стратегия погашения</p>
        <Tabs value={strategy} onValueChange={(v) => setStrategy(v as Strategy)}>
          <TabsList className="bg-[#f1f5f9] rounded-xl p-1 h-auto">
            {STRATEGIES.map((s) => (
              <TabsTrigger
                key={s.value}
                value={s.value}
                className="rounded-lg text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1e40af] data-[state=active]:shadow-sm"
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748b] font-medium">Новый срок погашения</p>
                <p className="text-2xl font-bold text-[#1e40af] mt-1.5">{formatMonths(improved.totalMonths)}</p>
                {savedMonths > 0 ? (
                  <p className="text-sm text-[#059669] font-semibold mt-1">на {formatMonths(savedMonths)} быстрее</p>
                ) : (
                  <p className="text-sm text-[#94a3b8] mt-1">добавьте доплату</p>
                )}
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#1e40af]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-sm rounded-2xl overflow-hidden ${savedMoney > 0 ? "bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5]" : "bg-white"}`}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#64748b] font-medium">Экономия на процентах</p>
                {savedMoney > 0 ? (
                  <>
                    <p className="text-3xl font-bold text-[#059669] mt-1.5">{formatCurrency(savedMoney)}</p>
                    <p className="text-sm text-[#059669] font-medium mt-1">останется в вашем кармане</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-[#f59e0b] mt-1.5">{formatCurrency(improved.totalInterestPaid)}</p>
                    <p className="text-sm text-[#94a3b8] mt-1">переплата по процентам</p>
                  </>
                )}
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${savedMoney > 0 ? "bg-emerald-100" : "bg-amber-50"}`}>
                {savedMoney > 0
                  ? <PiggyBank className="w-5 h-5 text-[#059669]" />
                  : <TrendingDown className="w-5 h-5 text-[#f59e0b]" />
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="px-6 pt-5 pb-0">
          <CardTitle className="text-base font-bold text-[#0f172a]">Сравнение планов погашения</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-4">
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
                stroke="#cbd5e1"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={false}
                name="baseline"
              />
              <Line
                type="monotone"
                dataKey="improved"
                stroke="#1e40af"
                strokeWidth={2.5}
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
          <h2 className="text-lg font-bold text-[#0f172a]">Порядок закрытия долгов</h2>
          <div className="space-y-2">
            {payoffOrder.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 bg-white border-0 shadow-sm rounded-2xl px-5 py-4">
                <div className="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#1e40af] text-sm font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <span className="flex-1 text-[#0f172a] font-medium">{c.creditorName}</span>
                <div className="flex items-center gap-1.5 text-sm text-[#64748b]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>месяц {c.closedAtMonth}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-[#94a3b8]">
        Расчёт носит информационный характер и не является финансовой консультацией.
        Реальные суммы зависят от условий договора, комиссий и других факторов.
      </p>
    </div>
  );
}
