"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/debt-calculator";
import type { DebtInput } from "@/lib/debt-calculator";

interface DebtWithOriginal extends DebtInput {
  originalBalance?: number;
}

interface DebtProgressListProps {
  debts: DebtWithOriginal[];
  payoffDates: Record<string, Date>;
}

function getRateColor(rate: number): string {
  if (rate > 30) return "#FF4D4D";
  if (rate > 20) return "#FFA04D";
  if (rate > 10) return "#4D9FFF";
  return "#4DFF91";
}

function getProgressGradient(rate: number): string {
  if (rate > 30) return "linear-gradient(90deg, #FF4D4D, #FFA04D)";
  if (rate > 20) return "linear-gradient(90deg, #FFA04D, #B5F562)";
  return "linear-gradient(90deg, #B5F562, #4DFF91)";
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
}

export function DebtProgressList({ debts, payoffDates }: DebtProgressListProps) {
  const sorted = [...debts].sort((a, b) => {
    const da = payoffDates[a.id]?.getTime() ?? Infinity;
    const db = payoffDates[b.id]?.getTime() ?? Infinity;
    return da - db;
  });

  const firstId = sorted[0]?.id;

  if (debts.length === 0) {
    return (
      <div
        className="rounded-[18px] p-8 text-center"
        style={{ border: "1px dashed var(--border-card)" }}
      >
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>Нет активных долгов</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="animate-fade-in-up stagger-3">
      <p style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "var(--text-tertiary)", paddingLeft: "2px" }}>
        Долги · {sorted.length}
      </p>
      {sorted.map((debt) => {
        const progress =
          debt.originalBalance && debt.originalBalance > 0
            ? Math.max(0, Math.min(100, ((debt.originalBalance - debt.currentBalance) / debt.originalBalance) * 100))
            : null;
        const isFirst = debt.id === firstId;
        const rateColor = getRateColor(debt.interestRate);
        const payoffDate = payoffDates[debt.id];

        return (
          <div
            key={debt.id}
            className="debt-progress-card"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-card)",
              padding: "20px 24px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>

              {/* Left: name + badges + rate */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Name row */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: rateColor, flexShrink: 0, display: "inline-block",
                    boxShadow: `0 0 6px ${rateColor}60`,
                  }} />
                  <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {debt.creditorName}
                  </span>
                </div>

                {/* Badges row */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px", paddingLeft: "18px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", background: "var(--bg-input)", borderRadius: "var(--radius-badge)", padding: "3px 8px" }}>
                    {debt.debtType}
                  </span>
                  {isFirst && (
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--color-success)", background: "var(--color-success-light)", borderRadius: "var(--radius-badge)", padding: "3px 10px" }}>
                      Первым
                    </span>
                  )}
                </div>

                {/* Rate + min payment */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "18px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: rateColor }}>{debt.interestRate}% год.</span>
                  <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>мин. {formatCurrency(debt.minimumPayment)}</span>
                </div>
              </div>

              {/* Right: balance + payoff date + edit */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", flexShrink: 0 }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.025em", color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", lineHeight: 1, display: "block" }}>
                    {formatCurrency(debt.currentBalance)}
                  </span>
                  {payoffDate && (
                    <span style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "3px", display: "block" }}>
                      до {formatShortDate(payoffDate)}
                    </span>
                  )}
                </div>
                <Link
                  href={`/debts/${debt.id}/edit`}
                  className="debt-edit-btn"
                  style={{
                    width: "28px", height: "28px", borderRadius: "6px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Pencil style={{ width: "13px", height: "13px" }} />
                </Link>
              </div>
            </div>

            {/* Progress bar */}
            {progress !== null && progress > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "6px" }}>
                  <span>Погашено</span>
                  <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ height: "6px", borderRadius: "3px", background: "var(--progress-bg)", overflow: "hidden" }}>
                  <div style={{
                    width: `${progress}%`, height: "100%", borderRadius: "3px",
                    background: getProgressGradient(debt.interestRate),
                    transition: "width 700ms ease",
                  }} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
