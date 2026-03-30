"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  calculatePayoff,
  formatCurrency,
  formatMonths,
  type DebtInput,
  type Strategy,
} from "@/lib/debt-calculator";
import { Clock, PiggyBank, TrendingDown, Share2, CheckCircle2, Zap, ArrowLeft } from "lucide-react";
import { ShareModal } from "@/components/share-modal";
import { useAnimatedNumber } from "@/hooks/use-animated-number";

interface Props {
  debts: DebtInput[];
  initialExtra?: number;
}

const STRATEGIES: { value: Strategy; label: string; desc: string }[] = [
  { value: "avalanche", label: "Лавина", desc: "Сначала дорогой" },
  { value: "snowball", label: "Снежный ком", desc: "Сначала маленький" },
  { value: "proportional", label: "Пропорционально", desc: "По доле" },
];

export function SimulatorClient({ debts, initialExtra = 0 }: Props) {
  // Slider value (immediate — for display)
  const [extra, setExtra] = useState(initialExtra);
  // Debounced value (used for calculations — avoids recalc on every px)
  const [calcExtra, setCalcExtra] = useState(0);
  const [strategy, setStrategy] = useState<Strategy>("avalanche");
  const [shareOpen, setShareOpen] = useState(false);

  // Debounce: delay calculation by 80ms
  useEffect(() => {
    const timer = setTimeout(() => setCalcExtra(extra), 80);
    return () => clearTimeout(timer);
  }, [extra]);

  const baseline = useMemo(() => calculatePayoff(debts, strategy, 0), [debts, strategy]);
  const improved = useMemo(
    () => calculatePayoff(debts, strategy, calcExtra),
    [debts, strategy, calcExtra]
  );

  const savedMonths = baseline.totalMonths - improved.totalMonths;
  const savedMoney = baseline.totalInterestPaid - improved.totalInterestPaid;

  // Animated display values
  const animatedTotalMonths = useAnimatedNumber(improved.totalMonths);
  const animatedSavedMonths = useAnimatedNumber(savedMonths);
  const animatedSavedMoney = useAnimatedNumber(Math.round(savedMoney));
  const animatedInterestPaid = useAnimatedNumber(Math.round(improved.totalInterestPaid));

  // Chart data
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
      improved: calcExtra > 0 ? (improvedMap.get(m) ?? 0) : undefined,
    }));
  }, [baseline, improved, calcExtra]);

  const payoffOrder = improved.debtClosures;
  const sliderPercent = (extra / 50000) * 100;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-7 pb-28 md:pb-8">
        {/* Header */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#1e40af] mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            К дашборду
          </Link>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Симулятор «Что если»</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Доплата сверх минимума — и картина меняется</p>
        </div>

        {/* ── A. SLIDER HERO ── */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <p className="text-sm font-semibold text-[#0f172a] mb-1">Доплата сверх минимума</p>
            <p className="text-xs text-[#94a3b8] mb-6">
              Сколько вы готовы платить сверх минимума каждый месяц
            </p>

            {/* Amount display */}
            <div className="text-center mb-7">
              <p className="text-5xl sm:text-6xl font-bold text-[#1e40af] tabular-nums tracking-tight">
                {extra === 0 ? "0 ₽" : formatCurrency(extra)}
              </p>
              <p className="text-sm text-[#94a3b8] mt-1.5">в месяц</p>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min={0}
                max={50000}
                step={1000}
                value={extra}
                onChange={(e) => setExtra(Number(e.target.value))}
                className="w-full h-3 appearance-none rounded-full cursor-pointer outline-none"
                style={{
                  background: `linear-gradient(to right, #1e40af ${sliderPercent}%, #e2e8f0 ${sliderPercent}%)`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#cbd5e1] mt-3 select-none">
              <span>0</span>
              <span>10k</span>
              <span>20k</span>
              <span>30k</span>
              <span>40k</span>
              <span>50 000 ₽</span>
            </div>

            {/* Quick picks */}
            <div className="flex flex-wrap gap-2 mt-5">
              {[1000, 3000, 5000, 10000, 20000].map((v) => (
                <button
                  key={v}
                  onClick={() => setExtra(v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    extra === v
                      ? "bg-[#1e40af] text-white shadow-sm"
                      : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                  }`}
                >
                  +{v.toLocaleString("ru")} ₽
                </button>
              ))}
              {extra > 0 && (
                <button
                  onClick={() => setExtra(0)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f1f5f9] text-[#94a3b8] hover:bg-[#e2e8f0] transition-all duration-150"
                >
                  Сбросить
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── B. LIVE IMPACT CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* New term */}
          <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Новый срок</p>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#1e40af]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#1e40af] tabular-nums">
                {formatMonths(animatedTotalMonths)}
              </p>
              {savedMonths > 0 ? (
                <p className="text-xs text-[#059669] font-semibold mt-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  на {formatMonths(animatedSavedMonths)} быстрее
                </p>
              ) : (
                <p className="text-xs text-[#94a3b8] mt-1.5">добавьте доплату</p>
              )}
            </CardContent>
          </Card>

          {/* Savings */}
          <Card
            className={`border-0 shadow-sm rounded-2xl overflow-hidden transition-colors duration-500 ${
              savedMoney > 0 ? "bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5]" : "bg-white"
            }`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Экономия</p>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500 ${
                    savedMoney > 0 ? "bg-emerald-100" : "bg-slate-50"
                  }`}
                >
                  <PiggyBank
                    className={`w-4 h-4 transition-colors duration-500 ${
                      savedMoney > 0 ? "text-[#059669]" : "text-[#94a3b8]"
                    }`}
                  />
                </div>
              </div>
              {savedMoney > 0 ? (
                <>
                  <p className="text-2xl font-bold text-[#059669] tabular-nums">
                    {formatCurrency(animatedSavedMoney)}
                  </p>
                  <p className="text-xs text-[#059669] mt-1.5 font-medium">останется у вас</p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-[#94a3b8]">—</p>
                  <p className="text-xs text-[#94a3b8] mt-1.5">двигайте ползунок</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Remaining interest */}
          <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">Переплата</p>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-[#f59e0b]" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#f59e0b] tabular-nums">
                {formatCurrency(animatedInterestPaid)}
              </p>
              <p className="text-xs text-[#94a3b8] mt-1.5">по процентам итого</p>
            </CardContent>
          </Card>
        </div>

        {/* ── C. STRATEGY TABS ── */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#0f172a]">Стратегия погашения</p>
          <Tabs value={strategy} onValueChange={(v) => setStrategy(v as Strategy)}>
            <TabsList className="bg-[#f1f5f9] rounded-2xl p-1.5 h-auto w-full sm:w-auto">
              {STRATEGIES.map((s) => (
                <TabsTrigger
                  key={s.value}
                  value={s.value}
                  className="flex-1 sm:flex-none rounded-xl text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1e40af] data-[state=active]:shadow-sm transition-all duration-150"
                >
                  <span className="font-semibold">{s.label}</span>
                  <span className="hidden sm:inline text-[#94a3b8] font-normal text-xs ml-1">
                    · {s.desc}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* ── D. BEFORE / AFTER CHART ── */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="px-4 sm:px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-[#0f172a]">Сравнение планов погашения</p>
              <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                <span className="flex items-center gap-1.5">
                  <span className="w-6 border-t-2 border-dashed border-[#cbd5e1] inline-block" />
                  Только минимум
                </span>
                {calcExtra > 0 && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-6 border-t-2 border-[#1e40af] inline-block" />
                    С доплатой
                  </span>
                )}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  label={{ value: "месяц", position: "insideBottom", offset: -10, fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e8edf4",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    fontSize: 13,
                  }}
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === "baseline" ? "Только минимум" : "С доплатой",
                  ]}
                  labelFormatter={(label) => `Месяц ${label}`}
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
                {calcExtra > 0 && (
                  <Line
                    type="monotone"
                    dataKey="improved"
                    stroke="#1e40af"
                    strokeWidth={2.5}
                    dot={false}
                    name="improved"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ── E. DEBT ORDER ── */}
        {payoffOrder.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#0f172a]">Порядок закрытия долгов</h2>
            <div className="space-y-2">
              {payoffOrder.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 bg-white border-0 shadow-sm rounded-2xl px-5 py-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#eff6ff] text-[#1e40af] text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="flex-1 font-medium text-[#0f172a]">{c.creditorName}</span>
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

      {/* ── STICKY MOBILE CTA ── */}
      {savedMoney > 0 && calcExtra > 0 && (
        <div className="md:hidden fixed bottom-[64px] left-0 right-0 px-4 z-20 pointer-events-none">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between pointer-events-auto">
            <div>
              <p className="text-xs text-[#94a3b8]">Потенциальная экономия</p>
              <p className="text-lg font-bold text-[#059669] tabular-nums">
                {formatCurrency(animatedSavedMoney)}
              </p>
            </div>
            <Button
              onClick={() => setShareOpen(true)}
              className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-sm font-semibold shadow-sm transition-all duration-200"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Поделиться
            </Button>
          </div>
        </div>
      )}

      {/* Share modal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={{ type: "scenario", savedMonths, savedMoney, extra: calcExtra }}
      />
    </>
  );
}
