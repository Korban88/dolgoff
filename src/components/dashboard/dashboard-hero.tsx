"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sliders, Plus } from "lucide-react";
import { formatCurrency, formatMonths, type PayoffResult } from "@/lib/debt-calculator";

interface DashboardHeroProps {
  result: PayoffResult;
  payoffDate: Date;
}

export function DashboardHero({ result, payoffDate }: DashboardHeroProps) {
  const dateLabel = payoffDate.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });

  return (
    <div
      className="rounded-[16px] animate-fade-in-up"
      style={{
        background: `linear-gradient(135deg, rgba(163,230,53,0.05) 0%, rgba(30,64,175,0.08) 100%), var(--surface-card)`,
        border: "1px solid rgba(163,230,53,0.15)",
        padding: "32px",
        boxShadow: "var(--shadow-card)",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Overline */}
      <p
        style={{
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "rgba(163,230,53,0.6)",
          marginBottom: "12px",
        }}
      >
        Дата закрытия всех долгов
      </p>

      {/* Hero date */}
      <p
        style={{
          fontSize: "48px",
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          marginBottom: "8px",
        }}
      >
        {dateLabel}
      </p>
      <p style={{ fontSize: "14px", color: "#8A8A8A", marginBottom: "28px" }}>
        {formatMonths(result.totalMonths)} при текущем плане
      </p>

      {/* Metric pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: "Переплата",       value: formatCurrency(result.totalInterestPaid) },
          { label: "Всего платежей",  value: formatCurrency(result.totalPaid) },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "8px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span style={{
              fontSize: "11px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#555555",
            }}>
              {label}
            </span>
            <span style={{
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#B5F562",
              fontVariantNumeric: "tabular-nums",
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          nativeButton={false} render={<Link href="/simulator" />}
          className="h-10 px-5 text-[14px] font-semibold transition-all duration-150"
          style={{
            background: "#B5F562",
            color: "#0A0A0A",
            border: "none",
            borderRadius: "var(--radius-button)",
          }}
        >
          <Sliders className="w-4 h-4 mr-2" style={{ strokeWidth: 2 }} />
          Симулятор
        </Button>
        <Button
          nativeButton={false} render={<Link href="/debts/new" />}
          className="h-10 px-5 text-[14px] font-semibold transition-all duration-150 hero-outline-btn"
          style={{
            background: "transparent",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "var(--radius-button)",
          }}
        >
          <Plus className="w-4 h-4 mr-1.5" style={{ strokeWidth: 2 }} />
          Долг
        </Button>
      </div>
    </div>
  );
}
