"use client";

import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  value: number;
  label: string;
  format?: "currency" | "months" | "percent" | "number";
  variant?: "default" | "success" | "warning" | "hero";
  animate?: boolean;
  className?: string;
  suffix?: string;
}

const variantStyles = {
  default: "bg-white border border-[#e2e8f0]",
  success: "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100",
  warning: "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100",
  hero: "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100",
};

const variantTextStyles = {
  default: "text-[#0f172a]",
  success: "text-[#059669]",
  warning: "text-[#f59e0b]",
  hero: "text-[#1e40af]",
};

function formatValue(value: number, format: MetricCardProps["format"], suffix?: string): string {
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "months":
      return formatMonths(value);
    case "percent":
      return `${value.toFixed(1)}%`;
    case "number":
      return suffix ? `${value.toLocaleString("ru-RU")} ${suffix}` : value.toLocaleString("ru-RU");
    default:
      return String(value);
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
}: MetricCardProps) {
  const animatedValue = useAnimatedNumber(value);
  const displayValue = animate ? animatedValue : value;

  return (
    <div className={cn("rounded-2xl p-4", variantStyles[variant], className)}>
      <p className="text-xs font-medium text-[#64748b] mb-1">{label}</p>
      <p className={cn("text-2xl font-bold tabular-nums", variantTextStyles[variant])}>
        {formatValue(displayValue, format, suffix)}
      </p>
    </div>
  );
}
