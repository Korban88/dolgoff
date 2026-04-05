"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sliders, Plus, CalendarCheck } from "lucide-react";
import { formatCurrency, formatMonths, type PayoffResult } from "@/lib/debt-calculator";

interface DashboardHeroProps {
  result: PayoffResult;
  payoffDate: Date;
}

export function DashboardHero({ result, payoffDate }: DashboardHeroProps) {
  const dateLabel = payoffDate.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });

  // Progress: cap at 60 months max for visual bar, fewer months = more progress
  const maxMonths = 60;
  const progressPct = Math.max(5, Math.round((1 - Math.min(result.totalMonths, maxMonths) / maxMonths) * 100));

  return (
    <div
      className="rounded-[18px] animate-fade-in-up overflow-hidden"
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-card)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Accent top bar */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, var(--accent-primary) ${progressPct}%, var(--border-card) ${progressPct}%)` }} />

      <div style={{ padding: "20px 24px 24px" }}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarCheck style={{ width: "14px", height: "14px", color: "var(--accent-primary)", strokeWidth: 2 }} />
              <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--accent-primary)" }}>
                Дата закрытия всех долгов
              </p>
            </div>
            <p style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              {dateLabel}
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              {formatMonths(result.totalMonths)} при текущем плане
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            <Button
              nativeButton={false} render={<Link href="/simulator" />}
              className="h-9 px-4 text-[13px] font-semibold transition-all duration-150"
              style={{ background: "var(--accent-primary)", color: "#FFFFFF", border: "none", borderRadius: "var(--radius-button)" }}
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5" style={{ strokeWidth: 2 }} />
              Симулятор
            </Button>
            <Button
              nativeButton={false} render={<Link href="/debts/new" />}
              className="h-9 px-4 text-[13px] font-semibold transition-all duration-150 hero-outline-btn"
              style={{ background: "transparent", color: "var(--text-primary)", border: "1px solid var(--border-card)", borderRadius: "var(--radius-button)" }}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" style={{ strokeWidth: 2 }} />
              Долг
            </Button>
          </div>
        </div>

        {/* Metric pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { label: "Переплата",      value: formatCurrency(result.totalInterestPaid) },
            { label: "Всего платежей", value: formatCurrency(result.totalPaid) },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-card)",
                borderRadius: "10px",
                padding: "8px 14px",
                display: "flex",
                flexDirection: "column",
                gap: "1px",
              }}
            >
              <span style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-tertiary)" }}>
                {label}
              </span>
              <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--accent-primary)", fontVariantNumeric: "tabular-nums" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>Прогресс к свободе</span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent-primary)" }}>{progressPct}%</span>
          </div>
          <div style={{ height: "6px", borderRadius: "3px", background: "var(--progress-bg)", overflow: "hidden" }}>
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                borderRadius: "3px",
                background: "linear-gradient(90deg, var(--accent-primary), var(--color-success))",
                transition: "width 800ms cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
