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

export default async function DebtsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const debts = await prisma.debt.findMany({
    where: { userId: session.user.id },
    orderBy: { interestRate: "desc" },
  });

  const activeDebts = debts.filter((d) => !d.isClosed);
  const closedDebts = debts.filter((d) => d.isClosed);

  return (
    <div className="max-w-3xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Мои долги</h1>
          <p className="text-sm text-[#64748b] mt-0.5">Управляйте всеми кредитами в одном месте</p>
        </div>
        <Button render={<Link href="/debts/new" />} className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-200 transition-all duration-200">
          <Plus className="w-4 h-4 mr-1.5" />Добавить долг
        </Button>
      </div>

      {activeDebts.length === 0 && (
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
              <Plus className="w-7 h-7 text-[#1e40af]" />
            </div>
            <p className="text-[#0f172a] font-semibold mb-1.5">Долгов пока нет</p>
            <p className="text-sm text-[#64748b] mb-6">Добавьте первый кредит, чтобы увидеть полную картину</p>
            <Button render={<Link href="/debts/new" />} className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl shadow-sm shadow-blue-200 transition-all duration-200">
              Добавить первый долг
            </Button>
          </CardContent>
        </Card>
      )}

      {activeDebts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest px-1">
            Активные — {activeDebts.length}
          </h2>
          {activeDebts.map((debt) => {
            const badgeClass = DEBT_TYPE_COLORS[debt.debtType] ?? "bg-slate-100 text-slate-600";
            return (
              <Card key={debt.id} className="border-0 shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow duration-200">
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-semibold text-[#0f172a] truncate">{debt.creditorName}</span>
                        <Badge className={`text-xs shrink-0 border-0 ${badgeClass}`}>
                          {debt.debtType}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-[#0f172a] font-medium">{formatCurrency(debt.currentBalance)}</span>
                        <span className="text-[#64748b]">{debt.interestRate}% год.</span>
                        <span className="text-[#64748b]">мин. {formatCurrency(debt.minimumPayment)}</span>
                      </div>
                    </div>
                    <Link
                      href={`/debts/${debt.id}/edit`}
                      className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center text-[#64748b] hover:bg-[#e2e8f0] hover:text-[#1e40af] transition-colors shrink-0"
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

      {closedDebts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest px-1">
            Закрытые — {closedDebts.length}
          </h2>
          {closedDebts.map((debt) => (
            <Card key={debt.id} className="border-0 shadow-sm rounded-2xl bg-white opacity-60">
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#64748b] truncate">{debt.creditorName}</span>
                      <Badge className="text-xs shrink-0 border-0 bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />Закрыт
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
