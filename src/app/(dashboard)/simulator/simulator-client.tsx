"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  calculatePayoff,
  formatCurrency,
  formatMonths,
  type DebtInput,
  type Strategy,
} from "@/lib/debt-calculator";
import { Clock, PiggyBank, TrendingDown, Share2, CheckCircle2, ArrowLeft, Zap, CalendarCheck } from "lucide-react";
import { ShareModal } from "@/components/share-modal";
import { LifeEquivalents } from "@/components/life-equivalents";
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

const QUICK_PICKS = [1000, 3000, 5000, 10000, 20000];

export function SimulatorClient({ debts, initialExtra = 0 }: Props) {
  const [extra, setExtra] = useState(initialExtra);
  const [calcExtra, setCalcExtra] = useState(initialExtra);
  const [strategy, setStrategy] = useState<Strategy>("avalanche");
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCalcExtra(extra), 80);
    return () => clearTimeout(timer);
  }, [extra]);

  const baseline = useMemo(() => calculatePayoff(debts, strategy, 0), [debts, strategy]);
  const improved = useMemo(() => calculatePayoff(debts, strategy, calcExtra), [debts, strategy, calcExtra]);

  const savedMonths = baseline.totalMonths - improved.totalMonths;
  const savedMoney = baseline.totalInterestPaid - improved.totalInterestPaid;
  const hasSavings = calcExtra > 0 && savedMoney > 0;

  const animatedTotalMonths = useAnimatedNumber(improved.totalMonths);
  const animatedSavedMonths = useAnimatedNumber(savedMonths);
  const animatedSavedMoney = useAnimatedNumber(Math.round(savedMoney));
  const animatedInterestPaid = useAnimatedNumber(Math.round(improved.totalInterestPaid));

  // Chart
  const chartData = useMemo(() => {
    const maxMonth = Math.max(baseline.totalMonths, improved.totalMonths);
    const step = Math.max(1, Math.floor(maxMonth / 36));
    const baseMap = new Map(baseline.schedule.map((s) => [s.month, s.totalBalance]));
    const improvedMap = new Map(improved.schedule.map((s) => [s.month, s.totalBalance]));
    const months: number[] = [];
    for (let m = 0; m <= maxMonth; m += step) months.push(m);
    if (months[months.length - 1] !== maxMonth) months.push(maxMonth);
    return months.map((m) => ({
      month: m,
      baseline: Math.round(baseMap.get(m) ?? 0),
      improved: calcExtra > 0 ? Math.round(improvedMap.get(m) ?? 0) : undefined,
    }));
  }, [baseline, improved, calcExtra]);

  const sliderPercent = (extra / 50000) * 100;

  // Payoff date for improved scenario
  const improvedPayoffDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + improved.totalMonths, 1);
  }, [improved.totalMonths]);

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6 pb-28 md:pb-8">
        {/* Header */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-[#667085] hover:text-[#6C63FF] mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            К дашборду
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Симулятор «Что если»</h1>
          <p className="text-sm text-[#667085] mt-0.5">Доплата сверх минимума — и картина меняется</p>
        </div>

        {/* Slider card */}
        <div className="bg-white rounded-3xl border border-[#E7ECF3] p-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          {/* Amount display */}
          <div className="text-center mb-7">
            <p className="text-xs font-semibold text-[#667085] uppercase tracking-wider mb-2">
              Доплата сверх минимума в месяц
            </p>
            <p className="text-6xl font-bold tabular-nums tracking-tight" style={{ color: extra > 0 ? "#6C63FF" : "#94a3b8" }}>
              {extra === 0 ? "0 ₽" : formatCurrency(extra)}
            </p>
            {hasSavings && (
              <div className="inline-flex items-center gap-1.5 mt-3 bg-[#F0FDF8] border border-[#BBF7D0] rounded-full px-3 py-1">
                <Zap className="w-3.5 h-3.5 text-[#12B76A]" />
                <span className="text-xs font-semibold text-[#059669]">
                  экономия {formatCurrency(animatedSavedMoney)}
                </span>
              </div>
            )}
          </div>

          {/* Slider */}
          <div className="px-1 mb-3">
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={extra}
              onChange={(e) => setExtra(Number(e.target.value))}
              className="w-full appearance-none cursor-pointer outline-none"
              style={{
                background: `linear-gradient(to right, #6C63FF ${sliderPercent}%, #E7ECF3 ${sliderPercent}%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#C0C8D8] select-none px-0.5 mb-5">
            <span>0</span>
            <span>10к</span>
            <span>20к</span>
            <span>30к</span>
            <span>40к</span>
            <span>50к ₽</span>
          </div>

          {/* Quick picks */}
          <div className="flex flex-wrap gap-2">
            {QUICK_PICKS.map((v) => (
              <button
                key={v}
                onClick={() => setExtra(v)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  extra === v
                    ? "bg-[#6C63FF] text-white shadow-sm shadow-[#6C63FF]/25"
                    : "bg-[#F7F8FC] text-[#667085] hover:bg-[#EEF2FF] hover:text-[#6C63FF]"
                }`}
              >
                +{v.toLocaleString("ru")} ₽
              </button>
            ))}
            {extra > 0 && (
              <button
                onClick={() => setExtra(0)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F7F8FC] text-[#94a3b8] hover:bg-[#F1F5F9] transition-all duration-150"
              >
                Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Impact cards */}
        <div className="grid grid-cols-3 gap-3">
          {/* New term */}
          <div className="bg-white rounded-2xl border border-[#E7ECF3] p-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3">
              <Clock className="w-4 h-4 text-[#6C63FF]" />
            </div>
            <p className="text-[10px] font-semibold text-[#667085] uppercase tracking-wide mb-1">Срок</p>
            <p className="text-lg font-bold text-[#0F172A] tabular-nums leading-none">
              {formatMonths(animatedTotalMonths)}
            </p>
            {savedMonths > 0 ? (
              <p className="text-[10px] text-[#12B76A] font-semibold mt-1.5">
                −{formatMonths(animatedSavedMonths)}
              </p>
            ) : (
              <p className="text-[10px] text-[#94a3b8] mt-1.5">добавьте доплату</p>
            )}
          </div>

          {/* Savings */}
          <div className={`rounded-2xl border p-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)] transition-colors duration-500 ${
            hasSavings ? "bg-[#F0FDF8] border-[#BBF7D0]" : "bg-white border-[#E7ECF3]"
          }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors duration-500 ${
              hasSavings ? "bg-[#12B76A]/10" : "bg-[#F7F8FC]"
            }`}>
              <PiggyBank className={`w-4 h-4 transition-colors duration-500 ${hasSavings ? "text-[#12B76A]" : "text-[#94a3b8]"}`} />
            </div>
            <p className="text-[10px] font-semibold text-[#667085] uppercase tracking-wide mb-1">Экономия</p>
            {hasSavings ? (
              <>
                <p className="text-lg font-bold text-[#12B76A] tabular-nums leading-none">
                  {formatCurrency(animatedSavedMoney)}
                </p>
                <p className="text-[10px] text-[#059669] mt-1.5 font-medium">останется у вас</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-[#94a3b8] leading-none">—</p>
                <p className="text-[10px] text-[#94a3b8] mt-1.5">двигайте ползунок</p>
              </>
            )}
          </div>

          {/* Interest */}
          <div className="bg-white rounded-2xl border border-[#E7ECF3] p-4 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
            <div className="w-8 h-8 rounded-xl bg-[#FFFBEB] flex items-center justify-center mb-3">
              <TrendingDown className="w-4 h-4 text-[#F79009]" />
            </div>
            <p className="text-[10px] font-semibold text-[#667085] uppercase tracking-wide mb-1">Переплата</p>
            <p className="text-lg font-bold text-[#D97706] tabular-nums leading-none">
              {formatCurrency(animatedInterestPaid)}
            </p>
            <p className="text-[10px] text-[#94a3b8] mt-1.5">по процентам</p>
          </div>
        </div>

        {/* New payoff date */}
        {hasSavings && (
          <div className="bg-[#F0FDF8] border border-[#BBF7D0] rounded-2xl px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#12B76A]/10 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5 text-[#12B76A]" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#065f46]/70">Новая дата закрытия всех долгов</p>
              <p className="font-numeric text-xl font-bold text-[#059669] leading-tight">
                {improvedPayoffDate.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
              </p>
              <p className="text-xs text-[#12B76A] font-medium mt-0.5">
                на {formatMonths(animatedSavedMonths)} раньше
              </p>
            </div>
          </div>
        )}

        {/* Life equivalents for saved money */}
        {hasSavings && savedMoney > 500 && (
          <LifeEquivalents
            amount={savedMoney}
            label="экономия — это"
            title="Что значит эта экономия"
          />
        )}

        {/* Strategy tabs */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[#0F172A]">Стратегия погашения</p>
          <Tabs value={strategy} onValueChange={(v) => setStrategy(v as Strategy)}>
            <TabsList className="bg-[#F7F8FC] border border-[#E7ECF3] rounded-2xl p-1.5 h-auto w-full">
              {STRATEGIES.map((s) => (
                <TabsTrigger
                  key={s.value}
                  value={s.value}
                  className="flex-1 rounded-xl text-xs px-3 py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C63FF] data-[state=active]:shadow-sm transition-all duration-150"
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

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-[#E7ECF3] p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-[#0F172A]">График</p>
            <div className="flex items-center gap-3 text-[10px] font-medium">
              <span className="flex items-center gap-1.5 text-[#94a3b8]">
                <span className="w-4 h-0.5 bg-[#C0C8D8] inline-block rounded" style={{ borderTop: "2px dashed #C0C8D8", width: 16 }} />
                Минимум
              </span>
              {calcExtra > 0 && (
                <span className="flex items-center gap-1.5 text-[#6C63FF]">
                  <span className="w-4 h-0.5 bg-[#6C63FF] inline-block rounded" />
                  +{formatCurrency(calcExtra)}/мес
                </span>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="simBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.07} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="simImproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#12B76A" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#12B76A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}м`}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}к`}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #E7ECF3", fontSize: 12 }}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "baseline" ? "Только минимум" : "С доплатой",
                ]}
                labelFormatter={(label) => `Месяц ${label}`}
              />
              <Area
                type="monotone"
                dataKey="baseline"
                stroke="#C0C8D8"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill="url(#simBaseline)"
                dot={false}
                name="baseline"
              />
              {calcExtra > 0 && (
                <Area
                  type="monotone"
                  dataKey="improved"
                  stroke="#6C63FF"
                  strokeWidth={2}
                  fill="url(#simImproved)"
                  dot={false}
                  name="improved"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payoff order */}
        {improved.debtClosures.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#0F172A]">Порядок закрытия</p>
            <div className="space-y-2">
              {improved.debtClosures.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3.5 bg-white border border-[#E7ECF3] rounded-2xl px-4 py-3 shadow-[0_1px_4px_rgba(15,23,42,0.04)]"
                >
                  <div className="w-7 h-7 rounded-xl bg-[#EEF2FF] text-[#6C63FF] text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="flex-1 text-sm font-medium text-[#0F172A]">{c.creditorName}</span>
                  <div className="flex items-center gap-1.5 text-xs text-[#667085]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#12B76A]" />
                    <span>месяц {c.closedAtMonth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-[#94a3b8]">
          Расчёт носит информационный характер и не является финансовой консультацией.
        </p>
      </div>

      {/* Sticky mobile CTA */}
      {hasSavings && (
        <div className="md:hidden fixed bottom-[64px] left-0 right-0 px-4 z-20 pointer-events-none">
          <div className="bg-white border border-[#E7ECF3] rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between pointer-events-auto">
            <div>
              <p className="text-[10px] text-[#94a3b8] font-medium">Потенциальная экономия</p>
              <p className="text-lg font-bold text-[#12B76A] tabular-nums">
                {formatCurrency(animatedSavedMoney)}
              </p>
            </div>
            <Button
              onClick={() => setShareOpen(true)}
              className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl text-sm font-semibold shadow-sm shadow-[#6C63FF]/25 transition-all duration-200"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Поделиться
            </Button>
          </div>
        </div>
      )}

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={{ type: "scenario", savedMonths, savedMoney, extra: calcExtra }}
      />
    </>
  );
}
