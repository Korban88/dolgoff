import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/debt-calculator";

const DEBT_TYPE_COLORS: Record<string, string> = {
  "Ипотека": "bg-blue-100 text-blue-700",
  "Автокредит": "bg-violet-100 text-violet-700",
  "Кредит наличными": "bg-sky-100 text-sky-700",
  "Кредитная карта": "bg-indigo-100 text-indigo-700",
  "Рассрочка": "bg-teal-100 text-teal-700",
  "МФО": "bg-orange-100 text-orange-700",
  "Другое": "bg-slate-100 text-slate-600",
};

// Left border color classes — listed explicitly for Tailwind JIT
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
  const avgRate =
    activeDebts.length > 0
      ? activeDebts.reduce((s, d) => s + d.interestRate, 0) / activeDebts.length
      : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Мои долги</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Управляйте всеми кредитами в одном месте</p>
        </div>
        <Button
          render={<Link href="/debts/new" />}
          className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-200 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-1.5" />Добавить долг
        </Button>
      </div>

      {/* Summary header (only when there are active debts) */}
      {activeDebts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-4">
              <p className="text-xs text-[#94a3b8] font-medium">Активных</p>
              <p className="text-xl font-bold text-[#0f172a] mt-1">{activeDebts.length}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">кредитов</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-4">
              <p className="text-xs text-[#94a3b8] font-medium">Общий остаток</p>
              <p className="text-lg font-bold text-[#0f172a] mt-1">{formatCurrency(totalBalance)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-4">
              <p className="text-xs text-[#94a3b8] font-medium">Средняя ставка</p>
              <p className="text-xl font-bold text-[#0f172a] mt-1">{avgRate.toFixed(1)}%</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">годовых</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl bg-white">
            <CardContent className="p-4">
              <p className="text-xs text-[#94a3b8] font-medium">Мин. платёж</p>
              <p className="text-lg font-bold text-[#0f172a] mt-1">{formatCurrency(totalMinPayment)}</p>
              <p className="text-xs text-[#94a3b8] mt-0.5">в месяц</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {activeDebts.length === 0 && (
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
              <Plus className="w-7 h-7 text-[#1e40af]" />
            </div>
            <p className="text-[#0f172a] font-semibold text-base mb-1.5">Долгов пока нет</p>
            <p className="text-sm text-[#64748b] mb-6 max-w-xs mx-auto">
              Добавьте первый кредит, чтобы увидеть полную картину и план погашения
            </p>
            <Button
              render={<Link href="/debts/new" />}
              className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-200 transition-all duration-200"
            >
              Добавить первый долг
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active debts */}
      {activeDebts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest px-1">
            Активные — {activeDebts.length}
          </h2>
          {activeDebts.map((debt, idx) => {
            const borderClass = getRateBorderClass(debt.interestRate);
            const badgeClass = DEBT_TYPE_COLORS[debt.debtType] ?? "bg-slate-100 text-slate-600";
            const isHighestRate = idx === 0 && activeDebts.length > 1;
            const progressPercent =
              debt.originalBalance &&
              debt.originalBalance > 0 &&
              debt.originalBalance >= debt.currentBalance
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
                        <Badge className={`text-xs shrink-0 border-0 ${badgeClass}`}>
                          {debt.debtType}
                        </Badge>
                        {isHighestRate && (
                          <Badge className="text-xs shrink-0 border-0 bg-orange-100 text-orange-700">
                            Самая высокая ставка
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="font-semibold text-[#0f172a]">
                          {formatCurrency(debt.currentBalance)}
                        </span>
                        <span className="text-[#64748b]">{debt.interestRate}% год.</span>
                        <span className="text-[#64748b]">мин. {formatCurrency(debt.minimumPayment)}</span>
                      </div>
                      {progressPercent !== null && (
                        <div className="mt-2.5">
                          <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
                            <span>Погашено</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#059669] rounded-full"
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
      )}

      {/* Closed debts */}
      {closedDebts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest px-1">
            Закрытые — {closedDebts.length}
          </h2>
          {closedDebts.map((debt) => (
            <Card key={debt.id} className="border-0 shadow-sm rounded-2xl bg-white opacity-55">
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#64748b] truncate">{debt.creditorName}</span>
                      <Badge className="text-xs shrink-0 border-0 bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />Закрыт
                      </Badge>
                    </div>
                    <p className="text-sm text-[#94a3b8]">{debt.debtType}</p>
                  </div>
                  <Link
                    href={`/debts/${debt.id}/edit`}
                    className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] transition-colors shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
