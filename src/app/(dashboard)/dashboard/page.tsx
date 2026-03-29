import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dbDebts = await prisma.debt.findMany({
    where: { userId: session.user.id, isClosed: false },
    orderBy: { interestRate: "desc" },
  });

  const debts = dbDebts.map((d) => ({
    id: d.id,
    creditorName: d.creditorName,
    debtType: d.debtType,
    currentBalance: d.currentBalance,
    originalBalance: d.originalBalance ?? undefined,
    interestRate: d.interestRate,
    minimumPayment: d.minimumPayment,
  }));

  if (debts.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto">
          <span className="text-3xl">📊</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Узнайте свою реальную переплату</h1>
          <p className="text-[#64748b] mt-2">
            Добавьте хотя бы один долг — и ДолгOFF покажет срок, переплату и эффект от сценариев погашения
          </p>
        </div>
        <Button
          render={<Link href="/debts/new" />}
          className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl px-6 h-11 text-base font-semibold shadow-sm shadow-blue-200 transition-all duration-200"
        >
          Добавить первый долг
        </Button>
      </div>
    );
  }

  return <DashboardClient debts={debts} />;
}
