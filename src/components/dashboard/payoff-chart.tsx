"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
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
  best?: number;
}

function buildChartData(baseResult: PayoffResult, bestResult?: PayoffResult): ChartDataPoint[] {
  const maxMonths = baseResult.totalMonths;
  const data: ChartDataPoint[] = [];

  for (let m = 0; m <= maxMonths; m++) {
    const baseSnap = baseResult.schedule[m];
    const bestSnap = bestResult?.schedule[m];

    data.push({
      month: m,
      label: formatMonthLabel(m),
      baseline: baseSnap ? baseSnap.totalBalance : 0,
      best: bestSnap ? bestSnap.totalBalance : 0,
    });
  }

  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-[#0f172a] mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "baseline" ? "Текущий план" : "С доплатой"}: {formatCurrency(Number(p.value))}
        </p>
      ))}
    </div>
  );
}

export function PayoffChart({ baseResult, bestResult, bestExtra }: PayoffChartProps) {
  const data = buildChartData(baseResult, bestResult);
  const closures = baseResult.debtClosures;

  // Show every ~6th label to avoid clutter
  const labelStep = Math.max(1, Math.floor(data.length / 6));

  return (
    <div className="rounded-2xl bg-white border border-[#e2e8f0] p-4">
      <p className="text-sm font-semibold text-[#0f172a] mb-4">График погашения</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradBaseline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradBest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            interval={labelStep - 1}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${Math.round(Number(v) / 1000)}к`}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} />
          {closures.map((c) => (
            <ReferenceLine
              key={c.id}
              x={formatMonthLabel(c.closedAtMonth)}
              stroke="#e2e8f0"
              strokeDasharray="3 3"
            />
          ))}
          <Area
            type="monotone"
            dataKey="baseline"
            name="baseline"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray={bestResult ? "5 3" : undefined}
            fill="url(#gradBaseline)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          {bestResult && (
            <Area
              type="monotone"
              dataKey="best"
              name="best"
              stroke="#059669"
              strokeWidth={2}
              fill="url(#gradBest)"
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      {bestResult && bestExtra && (
        <p className="text-xs text-center text-[#94a3b8] mt-2">
          Зелёный — с доплатой +{formatCurrency(bestExtra)}/мес
        </p>
      )}
    </div>
  );
}
