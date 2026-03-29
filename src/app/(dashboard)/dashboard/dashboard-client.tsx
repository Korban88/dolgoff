"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  calculatePayoff,
  compareStrategies,
  formatCurrency,
  formatMonths,
  type DebtInput,
} from "@/lib/debt-calculator";
import {
  Plus,
  Pencil,
  Trophy,
  Sliders,
  Share2,
  Info,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { ShareModal } from "@/components/share-modal";

interface DashboardDebt extends DebtInput {
  originalBalance?: number;
}

interface Props {
  debts: DashboardDebt[];
}

const STRATEGY_LABELS: Record<string, string> = {
  minimum: "Только минимум",
  avalanche: "Лавина",
  snowball: "Снежный ком",
  proportional: "Пропорционально",
};

const DEBT_TYPE_COLORS: Record<string, string> = {
  "Ипотека": "bg-blue-100 text-blue-700",
  "Автокредит": "bg-violet-100 text-violet-700",
  "Кредит наличными": "bg-sky-100 text-sky-700",
  "Кредитная карта": "bg-indigo-100 text-indigo-700",
  "Рассрочка": "bg-teal-100 text-teal-700",
  "МФО": "bg-orange-100 text-orange-700",
  "Другое": "bg-slate-100 text-slate-600",
};

// Border class by interest rate severity
const RATE_BORDER_CLASSES: Record<string, string> = {
  critical: "border-l-orange-400",
  high:     "border-l-amber-400",
  medium:   "border-l-blue-400",
  low:      "border-l-emerald-400",
};

function getRateBorderClass(rate: number): string {
  if (rate > 30) return RATE_BORDER_CLASSES.critical;
  if (rate > 20) return RATE_BORDER_CLASSES.high;
  if (rate > 10) return RATE_BORDER_CLASSES.medium;
  return RATE_BORDER_CLASSES.low;
}

const QUICK_WIN_AMOUNT = 5000;

export function DashboardClient({ debts }: Props) {
  const [shareOpen, setShareOpen] = useState(false);

  // Current plan (avalanche, no extra)
  const result = useMemo(() => calculatePayoff(debts, "avalanche", 0), [debts]);

  // Quick win scenario: +5000₽/month demo
  const quickWin = useMemo(() => calculatePayoff(debts, "avalanche", QUICK_WIN_AMOUNT), [debts]);

  // Strategy comparison
  const comparison = useMemo(() => compareStrategies(debts, 0), [debts]);

  // Aggregates
  const totalBalance = debts.reduce((s, d) => s + d.currentBalance, 0);
  const totalMinPayment = debts.reduce((s, d) => s + d.minimumPayment, 0);
  const overpayPercent =
    totalBalance > 0 ? Math.round((result.totalInterestPaid / totalBalance) * 100) : 0;

  // Quick win metrics
  const quickWinSavedMonths = result.totalMonths - quickWin.totalMonths;
  const quickWinSavedMoney = result.totalInterestPaid - quickWin.totalInterestPaid;

  // Debt closure map: id → closedAtMonth
  const closureMap = useMemo(
    () => new Map(result.debtClosures.map((c) => [c.id, c.closedAtMonth])),
    [result]
  );

  // Strategy comparison: are all strategies the same? (always true when extraMonthly = 0)
  const allStrategiesSame = useMemo(() => {
    const vals = Object.values(comparison);
    const first = vals[0].totalInterestPaid;
    return vals.every((v) => Math.abs(v.totalInterestPaid - first) < 1);
  }, [comparison]);

  // Best non-minimum strategy
  const bestStrategyKey = useMemo(
    () =>
      Object.entries(comparison).reduce(
        (best, [key, val]) =>
          key !== "minimum" &&
          val.totalInterestPaid < comparison[best as keyof typeof comparison].totalInterestPaid
            ? key
            : best,
        "avalanche"
      ),
    [comparison]
  );

  // Chart data (current plan only)
  const chartData = useMemo(() => {
    const step = Math.max(1, Math.floor(result.schedule.length / 60));
    return result.schedule
      .filter((_, i) => i % step === 0 || i === result.schedule.length - 1)
      .map((s) => ({ month: s.month, balance: Math.round(s.totalBalance) }));
  }, [result]);

  const closureMonths = result.debtClosures.map((c) => c.closedAtMonth);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Дашборд</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Полная картина ваших долгов</p>
        </div>
        <Button
          render={<Link href="/debts/new" />}
          className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-200 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-1.5" />Добавить долг
        </Button>
      </div>

      {/* ── A. HERO OUTCOME ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Payoff term */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]">
          <CardContent className="p-6 sm:p-7">
            <p className="text-sm font-semibold text-[#1e40af] mb-3">Вы закроете долги через</p>
            <p className="text-4xl sm:text-5xl font-bold text-[#0f172a] leading-none tracking-tight">
              {formatMonths(result.totalMonths)}
            </p>
            <p className="text-xs text-[#64748b] mt-4">Если платить только по текущему плану</p>
          </CardContent>
        </Card>

        {/* Overpayment */}
        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]">
          <CardContent className="p-6 sm:p-7">
            <p className="text-sm font-semibold text-[#92400e] mb-3 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              Переплата банкам
            </p>
            <p className="text-4xl sm:text-5xl font-bold text-[#78350f] leading-none tracking-tight">
              {formatCurrency(result.totalInterestPaid)}
            </p>
            <p className="text-xs text-[#b45309] mt-4">
              Столько вы заплатите сверх текущего долга · {overpayPercent}% от остатка
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── B. QUICK WIN STRIP ── */}
      {quickWinSavedMoney > 500 && (
        <div className="bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] border border-emerald-100 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#065f46] mb-2">
                Если добавить +{formatCurrency(QUICK_WIN_AMOUNT)} / мес
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {quickWinSavedMonths > 0 && (
                  <div>
                    <span className="text-2xl font-bold text-[#059669]">
                      на {formatMonths(quickWinSavedMonths)} быстрее
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-2xl font-bold text-[#059669]">
                    экономия {formatCurrency(quickWinSavedMoney)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#64748b] mt-2">
                Демонстрационный сценарий. Настройте свою сумму в симуляторе.
              </p>
            </div>
            <Button
              render={<Link href="/simulator" />}
              className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl shrink-0 whitespace-nowrap transition-all duration-200"
            >
              Ускорить погашение
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ── C. SECONDARY METRICS ── */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-[#94a3b8] font-medium">Общий долг</p>
            <p className="text-xl font-bold text-[#0f172a] mt-1">{formatCurrency(totalBalance)}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              {debts.length}{" "}
              {debts.length === 1
                ? "кредит"
                : debts.length < 5
                ? "кредита"
                : "кредитов"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-[#94a3b8] font-medium">Мин. платёж / мес</p>
            <p className="text-xl font-bold text-[#0f172a] mt-1">{formatCurrency(totalMinPayment)}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">суммарно по всем</p>
          </CardContent>
        </Card>
      </div>

      {/* ── D. DEBT LIST ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#0f172a]">Долги по убыванию ставки</h2>
        {debts.map((debt, idx) => {
          const borderClass = getRateBorderClass(debt.interestRate);
          const closureMonth = closureMap.get(debt.id);
          const isHighestRate = idx === 0 && debts.length > 1;
          const badgeClass = DEBT_TYPE_COLORS[debt.debtType] ?? "bg-slate-100 text-slate-600";
          const progressPercent =
            debt.originalBalance && debt.originalBalance > 0 && debt.originalBalance >= debt.currentBalance
              ? Math.max(0, Math.round((1 - debt.currentBalance / debt.originalBalance) * 100))
              : null;

          return (
            <Card
              key={debt.id}
              className={`border-0 border-l-4 ${borderClass} shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow duration-200`}
            >
              <CardContent className="py-4 px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                      <span className="font-semibold text-[#0f172a] truncate">{debt.creditorName}</span>
                      <Badge className={`text-xs shrink-0 border-0 ${badgeClass}`}>{debt.debtType}</Badge>
                      {isHighestRate && (
                        <Badge className="text-xs shrink-0 border-0 bg-orange-100 text-orange-700">
                          Самая высокая ставка
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span className="font-semibold text-[#0f172a]">{formatCurrency(debt.currentBalance)}</span>
                      <span className="text-[#64748b]">{debt.interestRate}% год.</span>
                      <span className="text-[#64748b]">мин. {formatCurrency(debt.minimumPayment)}</span>
                      {closureMonth !== undefined && (
                        <span className="text-[#94a3b8] text-xs self-center">
                          ~ через {formatMonths(closureMonth)}
                        </span>
                      )}
                    </div>
                    {progressPercent !== null && (
                      <div className="mt-2.5">
                        <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
                          <span>Погашено</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#059669] rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/debts/${debt.id}/edit`}
                    className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#1e40af] transition-colors shrink-0 mt-0.5"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── E. STRATEGY SECTION ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#0f172a]">Сравнение стратегий</h2>
        {allStrategiesSame ? (
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-[#1e40af]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0f172a] mb-1.5">
                    При текущем сценарии стратегии дают одинаковый результат
                  </p>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    Без доплаты стратегия не влияет на переплату — нет свободных средств для
                    перераспределения. Попробуйте симулятор: даже небольшая доплата покажет
                    разницу по сроку и переплате.
                  </p>
                  <Button
                    render={<Link href="/simulator" />}
                    className="mt-3 bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl text-sm transition-all duration-200"
                  >
                    <Sliders className="w-3.5 h-3.5 mr-1.5" />
                    Открыть симулятор
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-xs text-[#64748b]">При только минимальных платежах, без доплат</p>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-[#e8edf4]">
                      <th className="text-left px-5 py-3.5 font-semibold text-[#64748b]">Стратегия</th>
                      <th className="text-right px-5 py-3.5 font-semibold text-[#64748b]">Срок</th>
                      <th className="text-right px-5 py-3.5 font-semibold text-[#64748b]">Переплата</th>
                      <th className="text-right px-4 py-3.5 font-semibold text-[#64748b] hidden sm:table-cell">
                        Изменение
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(comparison).map(([key, val]) => {
                      const base = comparison.minimum;
                      const diffMoney = base.totalInterestPaid - val.totalInterestPaid;
                      const diffMonths = base.totalMonths - val.totalMonths;
                      const isBest = key === bestStrategyKey;
                      return (
                        <tr
                          key={key}
                          className={`border-b border-[#e8edf4] last:border-0 transition-colors ${
                            isBest ? "bg-[#f0fdf4]" : "hover:bg-[#f8fafc]"
                          }`}
                        >
                          <td className="px-5 py-3.5 font-medium text-[#0f172a]">
                            <div className="flex items-center gap-2">
                              {isBest && <Trophy className="w-3.5 h-3.5 text-[#059669]" />}
                              {STRATEGY_LABELS[key]}
                            </div>
                          </td>
                          <td
                            className={`px-5 py-3.5 text-right font-medium ${
                              isBest ? "text-[#059669]" : "text-[#0f172a]"
                            }`}
                          >
                            {formatMonths(val.totalMonths)}
                          </td>
                          <td
                            className={`px-5 py-3.5 text-right font-semibold ${
                              isBest ? "text-[#059669]" : "text-[#f59e0b]"
                            }`}
                          >
                            {formatCurrency(val.totalInterestPaid)}
                          </td>
                          <td className="px-4 py-3.5 text-right text-xs text-[#64748b] hidden sm:table-cell">
                            {key === "minimum" ? (
                              <span className="text-[#94a3b8]">базовый сценарий</span>
                            ) : diffMoney > 100 ? (
                              <span className="text-[#059669]">
                                −{formatCurrency(diffMoney)}
                                {diffMonths > 0 ? `, −${formatMonths(diffMonths)}` : ""}
                              </span>
                            ) : (
                              <span className="text-[#94a3b8]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
        <p className="text-xs text-[#94a3b8]">
          Расчёт носит информационный характер и не является финансовой консультацией.
        </p>
      </div>

      {/* ── F. PAYOFF CHART ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#0f172a]">График погашения</h2>
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="pt-5 pb-4 px-4 sm:px-6">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "месяц",
                    position: "insideBottom",
                    offset: -10,
                    fontSize: 11,
                    fill: "#94a3b8",
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e8edf4",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    fontSize: 13,
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), "Остаток"]}
                  labelFormatter={(label) => `Месяц ${label}`}
                />
                {closureMonths.map((m) => (
                  <ReferenceLine
                    key={m}
                    x={m}
                    stroke="#059669"
                    strokeDasharray="4 2"
                    strokeOpacity={0.6}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#1e40af"
                  strokeWidth={2.5}
                  dot={false}
                  name="Остаток долга"
                />
              </LineChart>
            </ResponsiveContainer>
            {result.debtClosures.length > 0 && (
              <p className="text-xs text-[#94a3b8] mt-1 px-1">
                <span className="inline-block w-3 h-0.5 bg-[#059669] opacity-60 mr-1 align-middle" />
                Закрытие долгов:{" "}
                {result.debtClosures
                  .map((c) => `${c.creditorName} (мес. ${c.closedAtMonth})`)
                  .join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── G. ACTION BAR ── */}
      <div className="border-t border-[#e8edf4] pt-6 pb-2">
        <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">
          Что дальше
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            render={<Link href="/simulator" />}
            className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-100 transition-all duration-200"
          >
            <Sliders className="w-4 h-4 mr-1.5" />
            Открыть симулятор
          </Button>
          <Button
            render={<Link href="/debts/new" />}
            variant="outline"
            className="border-[#e2e8f0] text-[#64748b] rounded-xl hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Добавить долг
          </Button>
          <Button
            variant="outline"
            className="rounded-xl border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            Поделиться
          </Button>
        </div>
      </div>

      {/* Share modal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={{ type: "overview" }}
      />
    </div>
  );
}
