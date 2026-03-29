import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DebtForm } from "@/components/debt-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewDebtPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/debts" className="text-[#64748b] hover:text-[#0f172a] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-[#0f172a]">Добавить долг</h1>
      </div>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-lg text-[#0f172a]">Информация о долге</CardTitle>
        </CardHeader>
        <CardContent>
          <DebtForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
