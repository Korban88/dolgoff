"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import type { PayoffResult } from "@/lib/debt-calculator";
import { ArrowRight, TrendingDown, Clock } from "lucide-react";

interface ScenarioCardsProps {
  presets: number[];
  baseResult: PayoffResult;
  scenarioResults: Record<number, PayoffResult>;
}

export function ScenarioCards({ presets, baseResult, scenarioResults }: ScenarioCardsProps) {
  return (
    <div id="scenario-cards" className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#0F172A]">Сценарии доплат</p>
        <Link
          href="/simulator"
          className="text-xs font-medium text-[#6C63FF] hover:underline underline-offset-2 flex items-center gap-1 transition-colors"
        >
          Свой вариант <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {presets.map((amount, idx) => {
          const result = scenarioResults[amount];
          if (!result) return null;
          const savedMonths = baseResult.totalMonths - result.totalMonths;
          const savedMoney = baseResult.totalInterestPaid - result.totalInterestPaid;
          const isHighlight = idx === 1;

          return (
            <motion.div
              key={amount}
              whileHover={{ scale: 1.025, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href={`/simulator?extra=${amount}`}
                className={`relative block rounded-2xl p-4 transition-shadow duration-200 ${
                  isHighlight
                    ? "text-white"
                    : "bg-white border border-[#E7ECF3] shadow-card hover:shadow-card-hover"
                }`}
                style={
                  isHighlight
                    ? {
                        background: "linear-gradient(135deg, #6C63FF, #5B8DEF)",
                        boxShadow: "0 6px 24px rgba(108,99,255,0.30), 0 2px 6px rgba(108,99,255,0.18)",
                      }
                    : undefined
                }
              >
                {isHighlight && (
                  <span className="absolute -top-2.5 left-4 text-[9px] font-bold bg-[#12B76A] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Лучший старт
                  </span>
                )}

                <p
                  className={`text-xs font-semibold mb-3 ${
                    isHighlight ? "text-white/70" : "text-[#6C63FF]"
                  }`}
                >
                  +{formatCurrency(amount)}/мес
                </p>

                {savedMonths > 0 && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isHighlight ? "text-white/70" : "text-[#12B76A]"
                      }`}
                    />
                    <p
                      className={`font-numeric text-xl font-bold leading-none ${
                        isHighlight ? "text-white" : "text-[#0F172A]"
                      }`}
                    >
                      −{formatMonths(savedMonths)}
                    </p>
                  </div>
                )}

                {savedMoney > 0 && (
                  <div className="flex items-center gap-1.5">
                    <TrendingDown
                      className={`w-3 h-3 shrink-0 ${
                        isHighlight ? "text-white/60" : "text-[#12B76A]"
                      }`}
                    />
                    <p
                      className={`font-numeric text-xs font-semibold ${
                        isHighlight ? "text-white/80" : "text-[#12B76A]"
                      }`}
                    >
                      экономия {formatCurrency(savedMoney)}
                    </p>
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
