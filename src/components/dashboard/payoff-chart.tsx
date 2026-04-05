"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
  const step = Math.max(1, Math.floor(maxMonths / 18));
  const data: ChartDataPoint[] = [];

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
  if (baseResult.schedule[maxMonths]) {
    data.push({ month: maxMonths, label: formatMonthLabel(maxMonths), baseline: 0, best: 0 });
  }
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[14px] px-4 py-3 text-[12px]"
      style={{
        background: "#1A1A1A",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <p className="font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>{label}</p>
      {payload.map((p: { name: string; value: number }) => (
        <p key={p.name} className="flex items-center gap-2 mb-0.5" style={{ color: "var(--text-secondary)" }}>
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: p.name === "baseline" ? "var(--text-tertiary)" : "var(--color-success)" }}
          />
          {p.name === "baseline" ? "Текущий план" : "С доплатой"}&thinsp;—&thinsp;
          <span className="font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
            {formatCurrency(Number(p.value))}
          </span>
        </p>
      ))}
    </div>
  );
}

export function PayoffChart({ baseResult, bestResult, bestExtra }: PayoffChartProps) {
  const data = buildChartData(baseResult, bestResult);

  return (
    <div
      className="rounded-[18px] p-5 animate-fade-in-up stagger-4"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
          График погашения
        </p>
        {bestResult && bestExtra && (
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1.5" style={{ color: "var(--text-tertiary)" }}>
              <span className="inline-block w-5 rounded" style={{ borderTop: "2px dashed var(--text-tertiary)" }} />
              Сейчас
            </span>
            <span className="flex items-center gap-1.5" style={{ color: "var(--color-success)" }}>
              <span className="inline-block w-5 h-0.5 rounded" style={{ background: "var(--color-success)" }} />
              +{formatCurrency(bestExtra)}/мес
            </span>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 2, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#9CA3B0" stopOpacity={0.06} />
              <stop offset="95%" stopColor="#9CA3B0" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradBest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#10B981" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid
            horizontal={true}
            vertical={false}
            strokeDasharray="4 4"
            stroke="var(--border-light)"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--text-tertiary)", fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-tertiary)" }}
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
            stroke="var(--text-tertiary)"
            strokeWidth={2}
            strokeDasharray={bestResult ? "6 4" : undefined}
            fill="url(#gradBase)"
            dot={false}
          />
          {bestResult && (
            <Area
              type="monotone"
              dataKey="best"
              name="best"
              stroke="var(--color-success)"
              strokeWidth={2.5}
              fill="url(#gradBest)"
              dot={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
