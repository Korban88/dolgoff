import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebtForm } from "@/components/debt-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditDebtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const debt = await prisma.debt.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!debt) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/debts" className="text-[#64748b] hover:text-[#0f172a] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">Редактировать долг</h1>
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-lg text-[#0f172a]">{debt.creditorName}</CardTitle>
        </CardHeader>
        <CardContent>
          <DebtForm
            mode="edit"
            initial={{
              id: debt.id,
              creditorName: debt.creditorName,
              debtType: debt.debtType,
              currentBalance: debt.currentBalance,
              originalBalance: debt.originalBalance,
              interestRate: debt.interestRate,
              minimumPayment: debt.minimumPayment,
              paymentDay: debt.paymentDay,
              isClosed: debt.isClosed,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
