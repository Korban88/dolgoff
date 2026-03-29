import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SimulatorClient } from "./simulator-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SimulatorPage() {
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
    interestRate: d.interestRate,
    minimumPayment: d.minimumPayment,
  }));

  if (debts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0f172a]">Симулятор «Что если»</h1>
        <p className="text-[#64748b]">Добавьте долги, чтобы воспользоваться симулятором.</p>
        <Button asChild className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white">
          <Link href="/debts/new">Добавить долг</Link>
        </Button>
      </div>
    );
  }

  return <SimulatorClient debts={debts} />;
}
