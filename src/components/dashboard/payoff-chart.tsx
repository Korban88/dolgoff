"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/debt-calculator";
import type { PayoffResult } from "@/lib/debt-calculator";

interface PayoffChartProps {
  baseResult: PayoffResult;
  bestResult?: PayoffResult;
  bestExtra?: number;
}

function formatMonthLabel(monthIndex: number): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth() + monthIndex, 1);
  return date.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
}

interface ChartDataPoint {
  month: number;
  label: string;
  baseline: number;
  best: number;
}

function buildChartData(baseResult: PayoffResult, bestResult?: PayoffResult): ChartDataPoint[] {
  const maxMonths = baseResult.totalMonths;
  const data: ChartDataPoint[] = [];
  const step = Math.max(1, Math.floor(maxMonths / 24));

  for (let m = 0; m <= maxMonths; m += step) {
    const baseSnap = baseResult.schedule[m];
    const bestSnap = bestResult?.schedule[m];
    data.push({
      month: m,
      label: formatMonthLabel(m),
      baseline: baseSnap ? Math.round(baseSnap.totalBalance) : 0,
      best: bestSnap ? Math.round(bestSnap.totalBalance) : 0,
    });
  }
  // Always include the last point
  const last = baseResult.schedule[maxMonths];
  if (last) {
    data.push({
      month: maxMonths,
      label: formatMonthLabel(maxMonths),
      baseline: 0,
      best: 0,
    });
  }

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E7ECF3] rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-[#0F172A] mb-1.5">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} className="flex items-center gap-1.5" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          {p.name === "baseline" ? "Текущий план" : "С доплатой"}:{" "}
          <span className="font-semibold">{formatCurrency(Number(p.value))}</span>
        </p>
      ))}
    </div>
  );
}

export function PayoffChart({ baseResult, bestResult, bestExtra }: PayoffChartProps) {
  const data = buildChartData(baseResult, bestResult);

  return (
    <div className="rounded-2xl bg-white border border-[#E7ECF3] p-5 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#0F172A]">График погашения</p>
        {bestResult && bestExtra && (
          <div className="flex items-center gap-3 text-[10px] font-medium">
            <span className="flex items-center gap-1 text-[#667085]">
              <span className="w-4 h-0.5 bg-[#6C63FF]/40 inline-block rounded" />
              Сейчас
            </span>
            <span className="flex items-center gap-1 text-[#12B76A]">
              <span className="w-4 h-0.5 bg-[#12B76A] inline-block rounded" />
              +{formatCurrency(bestExtra)}/мес
            </span>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradBaseline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradBest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#12B76A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#12B76A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}к`}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="baseline"
            name="baseline"
            stroke="#6C63FF"
            strokeWidth={1.5}
            strokeDasharray={bestResult ? "4 3" : undefined}
            strokeOpacity={0.5}
            fill="url(#gradBaseline)"
            dot={false}
          />
          {bestResult && (
            <Area
              type="monotone"
              dataKey="best"
              name="best"
              stroke="#12B76A"
              strokeWidth={2}
              fill="url(#gradBest)"
              dot={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
