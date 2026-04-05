"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  calculatePayoff, formatCurrency, formatMonths,
  type DebtInput, type Strategy,
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
  { value: "avalanche",    label: "Лавина",          desc: "Сначала дорогой" },
  { value: "snowball",     label: "Снежный ком",     desc: "Сначала маленький" },
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
  const savedMoney  = baseline.totalInterestPaid - improved.totalInterestPaid;
  const hasSavings  = calcExtra > 0 && savedMoney > 0;

  const animatedTotalMonths  = useAnimatedNumber(improved.totalMonths);
  const animatedSavedMonths  = useAnimatedNumber(savedMonths);
  const animatedSavedMoney   = useAnimatedNumber(Math.round(savedMoney));
  const animatedInterestPaid = useAnimatedNumber(Math.round(improved.totalInterestPaid));

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

  const improvedPayoffDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + improved.totalMonths, 1);
  }, [improved.totalMonths]);

  return (
    <>
      <div className="max-w-3xl mx-auto pb-28 md:pb-8" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Header */}
        <div>
          <Link
            href="/dashboard"
            className="sim-back-link inline-flex items-center gap-1.5 mb-4"
            style={{ fontSize: "12px", color: "#555555", textDecoration: "none" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            К дашборду
          </Link>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Симулятор «Что если»
          </h1>
          <p style={{ fontSize: "14px", color: "#8A8A8A", marginTop: "6px" }}>
            Доплата сверх минимума — и картина меняется
          </p>
        </div>

        {/* Slider card */}
        <div
          style={{
            background: "var(--surface-elevated)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius-card)",
            padding: "28px 28px 24px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Amount display */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8A8A8A", marginBottom: "10px" }}>
              Доплата сверх минимума в месяц
            </p>
            <p
              style={{
                fontSize: "40px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: extra > 0 ? "#B5F562" : "#555555",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {extra === 0 ? "0 ₽" : formatCurrency(extra)}
            </p>
            {hasSavings && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "12px",
                  background: "rgba(181,245,98,0.15)",
                  borderRadius: "20px",
                  padding: "6px 14px",
                }}
              >
                <Zap style={{ width: "14px", height: "14px", color: "#B5F562" }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#B5F562" }}>
                  экономия {formatCurrency(animatedSavedMoney)}
                </span>
              </div>
            )}
          </div>

          {/* Slider */}
          <div style={{ padding: "0 2px", marginBottom: "10px" }}>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={extra}
              onChange={(e) => setExtra(Number(e.target.value))}
              className="sim-slider w-full"
              style={{
                background: `linear-gradient(to right, #B5F562 ${sliderPercent}%, #2A2A2A ${sliderPercent}%)`,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#8A8A8A",
              marginBottom: "20px",
              userSelect: "none",
              padding: "0 2px",
            }}
          >
            <span>0</span><span>10к</span><span>20к</span><span>30к</span><span>40к</span><span>50к ₽</span>
          </div>

          {/* Quick picks */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {QUICK_PICKS.map((v) => (
              <button
                key={v}
                onClick={() => setExtra(v)}
                className="sim-quick-btn"
                style={
                  extra === v
                    ? {
                        background: "#B5F562",
                        color: "#0A0A0A",
                        border: "1px solid #B5F562",
                        borderRadius: "20px",
                        padding: "7px 16px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }
                    : {
                        background: "var(--surface-card)",
                        color: "#FFFFFF",
                        border: "1px solid var(--border-card)",
                        borderRadius: "20px",
                        padding: "7px 16px",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                      }
                }
              >
                +{v.toLocaleString("ru")} ₽
              </button>
            ))}
            {extra > 0 && (
              <button
                onClick={() => setExtra(0)}
                style={{
                  background: "transparent",
                  color: "#FF4D4D",
                  border: "none",
                  borderRadius: "20px",
                  padding: "7px 14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Impact cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", alignItems: "stretch" }}>
          {/* Term */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "16px",
              padding: "24px",
              minHeight: "160px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <Clock style={{ width: "16px", height: "16px", color: "#555555", strokeWidth: 1.75 }} />
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8A8A", marginBottom: "8px" }}>
              Срок
            </p>
            <p style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.025em", color: "#FFFFFF", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {formatMonths(animatedTotalMonths)}
            </p>
            {savedMonths > 0 ? (
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#4DFF91", marginTop: "8px" }}>
                −{formatMonths(animatedSavedMonths)}
              </p>
            ) : (
              <p style={{ fontSize: "12px", color: "#555555", marginTop: "8px" }}>
                добавьте доплату
              </p>
            )}
          </div>

          {/* Savings */}
          <div
            style={{
              background: hasSavings ? "rgba(163,230,53,0.03)" : "var(--surface-card)",
              border: hasSavings ? "1px solid rgba(163,230,53,0.2)" : "1px solid var(--border-card)",
              borderRadius: "16px",
              padding: "24px",
              minHeight: "160px",
              display: "flex",
              flexDirection: "column",
              transition: "border-color 500ms, background 500ms",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <PiggyBank
                style={{ width: "16px", height: "16px", strokeWidth: 1.75, color: hasSavings ? "#a3e635" : "#555555", transition: "color 500ms" }}
              />
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8A8A", marginBottom: "8px" }}>
              Экономия
            </p>
            {hasSavings ? (
              <>
                <p style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.025em", color: "#a3e635", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                  {formatCurrency(animatedSavedMoney)}
                </p>
                <p style={{ fontSize: "12px", color: "#555555", marginTop: "8px" }}>
                  останется у вас
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: "32px", fontWeight: 800, color: "#555555", lineHeight: 1 }}>—</p>
                <p style={{ fontSize: "12px", color: "#555555", marginTop: "8px" }}>
                  двигайте ползунок
                </p>
              </>
            )}
          </div>

          {/* Interest */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "16px",
              padding: "24px",
              minHeight: "160px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
              <TrendingDown style={{ width: "16px", height: "16px", color: "#FFA04D", strokeWidth: 1.75 }} />
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8A8A", marginBottom: "8px" }}>
              Переплата
            </p>
            <p style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.025em", color: "#FFFFFF", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(animatedInterestPaid)}
            </p>
            <p style={{ fontSize: "12px", color: "#555555", marginTop: "8px" }}>по процентам</p>
          </div>
        </div>

        {/* New payoff date */}
        {hasSavings && (
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-card)",
              borderLeft: "3px solid #a3e635",
              borderRadius: "12px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "rgba(163,230,53,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CalendarCheck style={{ width: "20px", height: "20px", color: "#a3e635", strokeWidth: 1.75 }} />
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 500, color: "#8A8A8A" }}>
                Новая дата закрытия всех долгов
              </p>
              <p style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF", lineHeight: 1.2 }}>
                {improvedPayoffDate.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
              </p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#a3e635", marginTop: "4px" }}>
                на {formatMonths(animatedSavedMonths)} раньше
              </p>
            </div>
          </div>
        )}

        {/* Life equivalents */}
        {hasSavings && savedMoney > 500 && (
          <LifeEquivalents amount={savedMoney} label="экономия — это" title="Что значит эта экономия" />
        )}

        {/* Strategy selector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>Стратегия погашения</p>
          <Tabs value={strategy} onValueChange={(v) => setStrategy(v as Strategy)}>
            <TabsList
              className="p-1 h-auto w-full rounded-[10px]"
              style={{ background: "var(--bg-sidebar)", border: "1px solid var(--border-card)" }}
            >
              {STRATEGIES.map((s) => (
                <TabsTrigger
                  key={s.value}
                  value={s.value}
                  className="flex-1 rounded-[8px] px-3 py-2 text-[12px] transition-all duration-150"
                  style={
                    strategy === s.value
                      ? { background: "#B5F562", color: "#0A0A0A", fontWeight: 700 }
                      : { color: "#8A8A8A" }
                  }
                >
                  <span className="font-semibold">{s.label}</span>
                  <span className="hidden sm:inline ml-1 text-[11px] opacity-60 font-normal">
                    · {s.desc}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Chart */}
        <div
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "var(--radius-card)",
            padding: "24px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>График</p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "11px", fontWeight: 500 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#555555" }}>
                <span style={{ width: 16, borderTop: "2px dashed rgba(255,255,255,0.2)", display: "inline-block" }} />
                Минимум
              </span>
              {calcExtra > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#a3e635" }}>
                  <span style={{ width: 16, height: 2, background: "#a3e635", display: "inline-block", borderRadius: 1 }} />
                  +{formatCurrency(calcExtra)}/мес
                </span>
              )}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="simBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="rgba(255,255,255,0.2)" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="rgba(255,255,255,0.2)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="simImproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#a3e635" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#a3e635" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid horizontal vertical={false} strokeDasharray="4 4" stroke="#2A2A2A" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#8A8A8A", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}м`}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#8A8A8A" }}
                tickFormatter={(v) => `${Math.round(Number(v) / 1000)}к`}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid var(--border-card)",
                  fontSize: 12,
                  background: "var(--surface-elevated)",
                  color: "#FFFFFF",
                  boxShadow: "var(--shadow-elevated)",
                }}
                formatter={(value, name) => [
                  formatCurrency(Number(value)),
                  name === "baseline" ? "Только минимум" : "С доплатой",
                ]}
                labelFormatter={(label) => `Месяц ${label}`}
              />
              <Area
                type="monotone"
                dataKey="baseline"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={2}
                strokeDasharray="6 4"
                fill="url(#simBaseline)"
                dot={false}
                name="baseline"
              />
              {calcExtra > 0 && (
                <Area
                  type="monotone"
                  dataKey="improved"
                  stroke="#a3e635"
                  strokeWidth={2.5}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>Порядок закрытия</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {improved.debtClosures.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      background: "rgba(163,230,53,0.1)",
                      color: "#a3e635",
                      fontSize: "12px", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ flex: 1, fontSize: "13px", fontWeight: 500, color: "#FFFFFF" }}>
                    {c.creditorName}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#8A8A8A" }}>
                    <CheckCircle2 style={{ width: "14px", height: "14px", color: "#4DFF91" }} />
                    <span>месяц {c.closedAtMonth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p style={{ fontSize: "10.5px", color: "#555555" }}>
          Расчёт носит информационный характер и не является финансовой консультацией.
        </p>
      </div>

      {/* Sticky mobile CTA */}
      {hasSavings && (
        <div className="md:hidden fixed bottom-[64px] left-0 right-0 px-4 z-20 pointer-events-none">
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "16px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            }}
            className="pointer-events-auto"
          >
            <div>
              <p style={{ fontSize: "10.5px", fontWeight: 500, color: "#8A8A8A" }}>
                Потенциальная экономия
              </p>
              <p style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.02em", color: "#a3e635" }}>
                {formatCurrency(animatedSavedMoney)}
              </p>
            </div>
            <Button
              onClick={() => setShareOpen(true)}
              style={{ background: "#B5F562", color: "#0A0A0A", borderRadius: "10px", fontSize: "13px", fontWeight: 700 }}
            >
              <Share2 style={{ width: "14px", height: "14px", marginRight: "6px" }} />
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
