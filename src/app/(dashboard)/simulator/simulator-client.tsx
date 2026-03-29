"use client";

import { useState, useMemo, useCallback } from "react";
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
import { Clock, PiggyBank, TrendingDown, Share2, CheckCircle2, Zap } from "lucide-react";
import { getScenarioShareText } from "@/lib/share";

interface Props {
  debts: DebtInput[];
}

const STRATEGIES: { value: Strategy; label: string; desc: string }[] = [
  { value: "avalanche", label: "Лавина", desc: "Сначала дорогой" },
  { value: "snowball", label: "Снежный ком", desc: "Сначала маленький" },
  { value: "proportional", label: "Пропорционально", desc: "По доле" },
];

export function SimulatorClient({ debts }: Props) {
  const [extra, setExtra] = useState(0);
  const [strategy, setStrategy] = useState<Strategy>("avalanche");
  const [copied, setCopied] = useState(false);

  const baseline = useMemo(() => calculatePayoff(debts, strategy, 0), [debts, strategy]);
  const improved = useMemo(() => calculatePayoff(debts, strategy, extra), [debts, strategy, extra]);

  const savedMonths = baseline.totalMonths - improved.totalMonths;
  const savedMoney = baseline.totalInterestPaid - improved.totalInterestPaid;

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
      improved: extra > 0 ? (improvedMap.get(m) ?? 0) : undefined,
    }));
  }, [baseline, improved, extra]);

  const payoffOrder = improved.debtClosures;

  const handleShare = useCallback(async () => {
    try {
      const text = getScenarioShareText(
        savedMonths,
        savedMoney,
        formatMonths(savedMonths),
        formatCurrency(savedMoney)
      );
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  }, [savedMonths, savedMoney]);

  const sliderPercent = (extra / 50000) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Симулятор «Что если»</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Узнайте, как доплата меняет всю картину</p>
      </div>

      {/* ── A. SLIDER HERO ── */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-[#0f172a] mb-1">
            Доплата к текущим платежам
          </p>
          <p className="text-xs text-[#94a3b8] mb-5">
            Сколько вы готовы платить сверх минимума каждый месяц
          </p>

          {/* Amount display */}
          <div className="text-center mb-6">
            <p className="text-5xl sm:text-6xl font-bold text-[#1e40af] tabular-nums tracking-tight transition-all duration-200">
              {extra === 0 ? "0 ₽" : formatCurrency(extra)}
            </p>
            <p className="text-sm text-[#94a3b8] mt-1">в месяц</p>
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
          <div className="flex justify-between text-xs text-[#cbd5e1] mt-2.5">
            <span>0 ₽</span>
            <span>10 000</span>
            <span>20 000</span>
            <span>30 000</span>
            <span>40 000</span>
            <span>50 000 ₽</span>
          </div>

          {/* Quick picks */}
          <div className="flex flex-wrap gap-2 mt-4">
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
          </div>
        </CardContent>
      </Card>

      {/* ── B. LIVE IMPACT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* New term */}
        <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                Новый срок
              </p>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-[#1e40af]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1e40af] tabular-nums transition-all duration-300">
              {formatMonths(improved.totalMonths)}
            </p>
            {savedMonths > 0 ? (
              <p className="text-xs text-[#059669] font-semibold mt-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                на {formatMonths(savedMonths)} быстрее
              </p>
            ) : (
              <p className="text-xs text-[#94a3b8] mt-1.5">добавьте доплату</p>
            )}
          </CardContent>
        </Card>

        {/* Savings on interest */}
        <Card
          className={`border-0 shadow-sm rounded-2xl overflow-hidden transition-all duration-300 ${
            savedMoney > 0 ? "bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5]" : "bg-white"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                Экономия
              </p>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  savedMoney > 0 ? "bg-emerald-100" : "bg-slate-50"
                }`}
              >
                <PiggyBank
                  className={`w-4 h-4 transition-colors duration-300 ${
                    savedMoney > 0 ? "text-[#059669]" : "text-[#94a3b8]"
                  }`}
                />
              </div>
            </div>
            {savedMoney > 0 ? (
              <>
                <p className="text-2xl font-bold text-[#059669] tabular-nums transition-all duration-300">
                  {formatCurrency(savedMoney)}
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
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                Переплата
              </p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-[#f59e0b]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#f59e0b] tabular-nums transition-all duration-300">
              {formatCurrency(improved.totalInterestPaid)}
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
                className="flex-1 sm:flex-none rounded-xl text-xs sm:text-sm px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-[#1e40af] data-[state=active]:shadow-sm transition-all duration-150 flex flex-col sm:flex-row items-center gap-0.5"
              >
                <span className="font-semibold">{s.label}</span>
                <span className="hidden sm:inline text-[#94a3b8] font-normal text-xs">
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
            <div className="flex items-center gap-3 text-xs text-[#64748b]">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-[#cbd5e1] inline-block rounded border-dashed" style={{ borderTop: "2px dashed #cbd5e1", background: "none" }} />
                Только минимум
              </span>
              {extra > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-0.5 bg-[#1e40af] inline-block rounded" />
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
              {extra > 0 && (
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

      {/* ── F. SHARE RESULT ── */}
      {savedMoney > 0 && (
        <div className="bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] border border-emerald-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#065f46] text-sm mb-0.5">Поделитесь сценарием</p>
            <p className="text-xs text-[#64748b]">
              Скопируется анонимный текст — без банков и суммы долга
            </p>
          </div>
          <Button
            variant="outline"
            className={`rounded-xl shrink-0 border transition-all duration-200 ${
              copied
                ? "bg-emerald-100 text-[#059669] border-emerald-200"
                : "border-emerald-200 text-[#065f46] hover:bg-emerald-100"
            }`}
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            {copied ? "Скопировано!" : "Поделиться сценарием"}
          </Button>
        </div>
      )}

      <p className="text-xs text-[#94a3b8]">
        Расчёт носит информационный характер и не является финансовой консультацией.
        Реальные суммы зависят от условий договора, комиссий и других факторов.
      </p>
    </div>
  );
}
