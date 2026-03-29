import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/debt-calculator";

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0f172a]">Мои долги</h1>
        <Button render={<Link href="/debts/new" />} className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Добавить долг
        </Button>
      </div>

      {activeDebts.length === 0 && (
        <Card className="border-[#e2e8f0]">
          <CardContent className="py-12 text-center">
            <p className="text-[#64748b] mb-4">У вас пока нет активных долгов</p>
            <Button render={<Link href="/debts/new" />} className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white">
              Добавить первый долг
            </Button>
          </CardContent>
        </Card>
      )}

      {activeDebts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-[#64748b] uppercase tracking-wide">
            Активные долги ({activeDebts.length})
          </h2>
          {activeDebts.map((debt) => (
            <Card key={debt.id} className="border-[#e2e8f0] hover:shadow-sm transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#0f172a] truncate">{debt.creditorName}</span>
                      <Badge variant="secondary" className="text-xs shrink-0 bg-[#eff6ff] text-[#1e40af]">
                        {debt.debtType}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#64748b]">
                      <span>Остаток: <strong className="text-[#0f172a]">{formatCurrency(debt.currentBalance)}</strong></span>
                      <span>Ставка: <strong className="text-[#0f172a]">{debt.interestRate}% год.</strong></span>
                      <span>Мин. платёж: <strong className="text-[#0f172a]">{formatCurrency(debt.minimumPayment)}</strong></span>
                    </div>
                  </div>
                  <Link
                    href={`/debts/${debt.id}/edit`}
                    className="shrink-0 p-2 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {closedDebts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-[#64748b] uppercase tracking-wide">
            Закрытые долги ({closedDebts.length})
          </h2>
          {closedDebts.map((debt) => (
            <Card key={debt.id} className="border-[#e2e8f0] opacity-60">
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#64748b]">{debt.creditorName}</span>
                      <Badge variant="secondary" className="text-xs bg-[#d1fae5] text-[#059669]">Закрыт</Badge>
                    </div>
                    <p className="text-sm text-[#64748b] mt-0.5">{debt.debtType}</p>
                  </div>
                  <Link
                    href={`/debts/${debt.id}/edit`}
                    className="p-2 rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
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
