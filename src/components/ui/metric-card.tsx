"use client";

import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  value: number;
  label: string;
  format?: "currency" | "months" | "percent" | "number";
  variant?: "default" | "success" | "warning" | "accent";
  animate?: boolean;
  className?: string;
  suffix?: string;
  sublabel?: string;
  icon?: LucideIcon;
  trend?: { label: string; positive?: boolean };
}

function formatValue(value: number, format: MetricCardProps["format"], suffix?: string): string {
  switch (format) {
    case "currency": return formatCurrency(value);
    case "months":   return formatMonths(value);
    case "percent":  return `${value.toFixed(1)}%`;
    case "number":   return suffix ? `${value.toLocaleString("ru-RU")} ${suffix}` : value.toLocaleString("ru-RU");
    default:         return String(value);
  }
}

export function MetricCard({
  value,
  label,
  format = "currency",
  variant = "default",
  animate = true,
  className,
  suffix,
  sublabel,
  icon: Icon,
  trend,
}: MetricCardProps) {
  const animatedValue = useAnimatedNumber(value);
  const displayValue = animate ? animatedValue : value;

  return (
    <div
      className={cn("transition-all duration-200", className)}
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "var(--radius-card)",
        padding: "24px",
        boxShadow: "var(--shadow-card)",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      {Icon && (
        <div
          className="mb-3 flex items-center justify-center"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(181,245,98,0.08)",
          }}
        >
          <Icon className="w-5 h-5" style={{ strokeWidth: 1.75, color: "#B5F562" }} />
        </div>
      )}
      <p
        style={{
          fontSize: "12px",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#8A8A8A",
          marginBottom: "8px",
        }}
      >
        {label}
      </p>
      <p
        className="tabular-nums leading-none"
        style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.025em", color: "#FFFFFF" }}
      >
        {formatValue(displayValue, format, suffix)}
      </p>
      {trend && (
        <p
          className="text-[12px] font-medium mt-1.5"
          style={{ color: trend.positive !== false ? "var(--color-success)" : "var(--color-danger)" }}
        >
          {trend.label}
        </p>
      )}
      {sublabel && !trend && (
        <p className="text-[12px] mt-1.5" style={{ color: "#555555" }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
