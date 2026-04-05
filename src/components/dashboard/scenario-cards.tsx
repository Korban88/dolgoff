"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import type { PayoffResult } from "@/lib/debt-calculator";
import { ArrowRight } from "lucide-react";

interface ScenarioCardsProps {
  presets: number[];
  baseResult: PayoffResult;
  scenarioResults: Record<number, PayoffResult>;
}

export function ScenarioCards({ presets, baseResult, scenarioResults }: ScenarioCardsProps) {
  return (
    <div className="space-y-3 animate-fade-in-up stagger-2">
      <div className="flex items-center justify-between">
        <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
          Сценарии доплат
        </p>
        <Link
          href="/simulator"
          className="flex items-center gap-1 transition-colors"
          style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)")}
        >
          Свой расчёт <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {presets.map((amount, idx) => {
          const result = scenarioResults[amount];
          if (!result) return null;
          const savedMonths = baseResult.totalMonths - result.totalMonths;
          const savedMoney  = baseResult.totalInterestPaid - result.totalInterestPaid;
          const isHighlight = idx === 1;

          return (
            <motion.div
              key={amount}
              whileHover={{ scale: 1.02, boxShadow: "var(--shadow-card-hover)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{ position: "relative" }}
            >
              {isHighlight && (
                <span
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--accent-primary)",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderRadius: "6px",
                    padding: "3px 10px",
                    whiteSpace: "nowrap",
                    zIndex: 1,
                  }}
                >
                  Быстрый старт
                </span>
              )}

              <Link
                href={`/simulator?extra=${amount}`}
                className="relative block p-5"
                style={{
                  background: isHighlight ? "var(--accent-bg)" : "var(--surface-card)",
                  border: isHighlight ? "1px solid var(--accent-primary)" : "1px solid var(--border-card)",
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--text-tertiary)",
                    marginBottom: "12px",
                  }}
                >
                  +{formatCurrency(amount)}/мес
                </p>

                {savedMonths > 0 && (
                  <p
                    className="tabular-nums leading-none"
                    style={{
                      fontSize: "28px",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                    }}
                  >
                    −{formatMonths(savedMonths)}
                  </p>
                )}

                {savedMoney > 0 && (
                  <p
                    className="tabular-nums"
                    style={{ fontSize: "12px", fontWeight: 600, marginTop: "8px", color: "var(--accent-primary)" }}
                  >
                    ✧ экономия {formatCurrency(savedMoney)}
                  </p>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
