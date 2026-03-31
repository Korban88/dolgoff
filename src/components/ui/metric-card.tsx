"use client";

import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  value: number;
  label: string;
  format?: "currency" | "months" | "percent" | "number";
  variant?: "default" | "success" | "warning" | "accent";
  animate?: boolean;
  className?: string;
  suffix?: string;
  sublabel?: string;
}

const variantStyles = {
  default:  "bg-white border border-[#E7ECF3] shadow-[0_1px_4px_rgba(15,23,42,0.04)]",
  success:  "bg-[#F0FDF8] border border-[#BBF7D0]",
  warning:  "bg-[#FFFBEB] border border-[#FDE68A]",
  accent:   "bg-[#EEF2FF] border border-[#C7D2FE]",
};

const variantTextStyles = {
  default:  "text-[#0F172A]",
  success:  "text-[#059669]",
  warning:  "text-[#D97706]",
  accent:   "text-[#6C63FF]",
};

const variantLabelStyles = {
  default:  "text-[#667085]",
  success:  "text-[#065f46]",
  warning:  "text-[#92400e]",
  accent:   "text-[#4338ca]",
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
  sublabel,
}: MetricCardProps) {
  const animatedValue = useAnimatedNumber(value);
  const displayValue = animate ? animatedValue : value;

  return (
    <div className={cn("rounded-2xl p-4", variantStyles[variant], className)}>
      <p className={cn("text-xs font-medium mb-1.5 tracking-wide", variantLabelStyles[variant])}>
        {label}
      </p>
      <p className={cn("text-2xl font-bold tabular-nums leading-none", variantTextStyles[variant])}>
        {formatValue(displayValue, format, suffix)}
      </p>
      {sublabel && (
        <p className={cn("text-xs mt-1.5 opacity-70", variantLabelStyles[variant])}>{sublabel}</p>
      )}
    </div>
  );
}
