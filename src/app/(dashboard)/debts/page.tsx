import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/debt-calculator";

// Left-border classes — explicit for Tailwind JIT
const RATE_BORDER: Record<string, string> = {
  critical: "border-l-orange-400",
  high:     "border-l-amber-400",
  medium:   "border-l-[#6C63FF]",
  low:      "border-l-emerald-400",
};

function getBorder(rate: number) {
  if (rate > 30) return RATE_BORDER.critical;
  if (rate > 20) return RATE_BORDER.high;
  if (rate > 10) return RATE_BORDER.medium;
  return RATE_BORDER.low;
}

// Smart neutral tag logic — no advisory language
function getSmartTag(
  debt: { id: string; interestRate: number; currentBalance: number; minimumPayment: number },
  allDebts: typeof debt[]
): { label: string; color: string } | null {
  const maxRate = Math.max(...allDebts.map((d) => d.interestRate));
  const minBalance = Math.min(...allDebts.map((d) => d.currentBalance));
  const maxPayment = Math.max(...allDebts.map((d) => d.minimumPayment));

  if (allDebts.length < 2) return null;
  if (debt.interestRate === maxRate) return { label: "Высокая ставка", color: "bg-orange-50 text-orange-600 border-orange-100" };
  if (debt.currentBalance === minBalance) return { label: "Наименьший остаток", color: "bg-emerald-50 text-emerald-600 border-emerald-100" };
  if (debt.minimumPayment === maxPayment) return { label: "Наибольший платёж", color: "bg-blue-50 text-blue-600 border-blue-100" };
  return null;
}

export default async function DebtsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const debts = await prisma.debt.findMany({
    where: { userId: session.user.id },
    orderBy: { interestRate: "desc" },
  });

  const activeDebts = debts.filter((d) => !d.isClosed);
  const closedDebts = debts.filter((d) => d.isClosed);

  const totalBalance = activeDebts.reduce((s, d) => s + d.currentBalance, 0);
  const totalMinPayment = activeDebts.reduce((s, d) => s + d.minimumPayment, 0);
  // Weighted average rate by balance
  const weightedRate =
    totalBalance > 0
      ? activeDebts.reduce((s, d) => s + d.interestRate * d.currentBalance, 0) / totalBalance
      : 0;

  const activeForTags = activeDebts.map((d) => ({
    id: d.id,
    interestRate: d.interestRate,
    currentBalance: d.currentBalance,
    minimumPayment: d.minimumPayment,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Мои долги</h1>
          <p className="text-sm text-[#667085] mt-0.5">Все кредиты в одном месте</p>
        </div>
        <Button
          render={<Link href="/debts/new" />}
          className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl shadow-sm shadow-[#6C63FF]/20 h-9 px-4 text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 mr-1" />+ Новый долг
        </Button>
      </div>

      {/* Summary strip */}
      {activeDebts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Кредитов", value: String(activeDebts.length), sub: "активных" },
            { label: "Общий остаток", value: formatCurrency(totalBalance), sub: "" },
            { label: "Взвеш. ставка", value: `${weightedRate.toFixed(1)}%`, sub: "годовых" },
            { label: "Платёж / мес", value: formatCurrency(totalMinPayment), sub: "минимум" },
          ].map(({ label, value, sub }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-[#E7ECF3] shadow-card p-4"
            >
              <p className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="font-numeric text-lg font-bold text-[#0F172A] leading-tight">{value}</p>
              {sub && <p className="text-[10px] text-[#94a3b8] mt-0.5">{sub}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {activeDebts.length === 0 && (
        <div className="bg-white rounded-3xl border border-[#E7ECF3] shadow-card py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-5">
            <Plus className="w-7 h-7 text-[#6C63FF]" />
          </div>
          <p className="font-semibold text-[#0F172A] mb-2">Долгов пока нет</p>
          <p className="text-sm text-[#667085] mb-6 max-w-xs mx-auto">
            Добавьте первый кредит — и увидите полную картину и план погашения
          </p>
          <Button
            render={<Link href="/debts/new" />}
            className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl shadow-sm shadow-[#6C63FF]/20 px-6 h-10 font-semibold"
          >
            Добавить первый долг
          </Button>
        </div>
      )}

      {/* Active debts */}
      {activeDebts.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest px-1">
            Активные · {activeDebts.length}
          </p>
          {activeDebts.map((debt) => {
            const tag = getSmartTag(
              { id: debt.id, interestRate: debt.interestRate, currentBalance: debt.currentBalance, minimumPayment: debt.minimumPayment },
              activeForTags
            );
            const progressPercent =
              debt.originalBalance &&
              debt.originalBalance > 0 &&
              debt.originalBalance >= debt.currentBalance
                ? Math.max(0, Math.round((1 - debt.currentBalance / debt.originalBalance) * 100))
                : null;

            return (
              <div
                key={debt.id}
                className={`bg-white border border-[#E7ECF3] border-l-4 ${getBorder(debt.interestRate)} rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 px-5 py-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Name + tags */}
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="font-semibold text-[#0F172A] text-sm truncate">
                        {debt.creditorName}
                      </span>
                      <span className="text-[10px] font-medium text-[#667085] bg-[#F7F8FC] border border-[#E7ECF3] px-2 py-0.5 rounded-full">
                        {debt.debtType}
                      </span>
                      {tag && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tag.color}`}>
                          {tag.label}
                        </span>
                      )}
                    </div>

                    {/* Metrics row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="font-numeric text-base font-bold text-[#0F172A]">
                        {formatCurrency(debt.currentBalance)}
                      </span>
                      <span className="text-xs text-[#667085]">{debt.interestRate}% год.</span>
                      <span className="text-xs text-[#667085]">
                        мин. {formatCurrency(debt.minimumPayment)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {progressPercent !== null && (
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-[#94a3b8] mb-1">
                          <span>Погашено</span>
                          <span className="font-semibold">{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${progressPercent}%`,
                              background:
                                debt.interestRate > 20
                                  ? "linear-gradient(90deg, #F79009, #FBBF24)"
                                  : "linear-gradient(90deg, #6C63FF, #5B8DEF)",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/debts/${debt.id}/edit`}
                    className="w-8 h-8 rounded-xl bg-[#F7F8FC] flex items-center justify-center text-[#667085] hover:bg-[#EEF2FF] hover:text-[#6C63FF] transition-colors shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Closed debts */}
      {closedDebts.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest px-1">
            Закрытые · {closedDebts.length}
          </p>
          {closedDebts.map((debt) => (
            <div
              key={debt.id}
              className="bg-white border border-[#E7ECF3] rounded-2xl px-5 py-4 opacity-50 hover:opacity-70 transition-opacity"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#667085] truncate text-sm">{debt.creditorName}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Закрыт
                    </span>
                  </div>
                  <p className="text-xs text-[#94a3b8]">{debt.debtType}</p>
                </div>
                <Link
                  href={`/debts/${debt.id}/edit`}
                  className="w-7 h-7 rounded-lg bg-[#F7F8FC] flex items-center justify-center text-[#94a3b8] hover:bg-[#E7ECF3] transition-colors shrink-0"
                >
                  <Pencil className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
