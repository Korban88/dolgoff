"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CREDITORS = [
  "Сбербанк", "Тинькофф", "Альфа-Банк", "ВТБ", "Почта Банк",
  "Хоум Банк", "Совкомбанк", "Озон Банк", "МТС Банк", "Газпромбанк",
];

const DEBT_TYPES = [
  "Ипотека", "Автокредит", "Кредит наличными", "Кредитная карта",
  "Рассрочка", "МФО", "Другое",
];

interface DebtFormProps {
  initial?: {
    id?: string;
    creditorName?: string;
    debtType?: string;
    currentBalance?: number;
    originalBalance?: number | null;
    interestRate?: number;
    minimumPayment?: number;
    paymentDay?: number | null;
    isClosed?: boolean;
  };
  mode: "create" | "edit";
}

export function DebtForm({ initial, mode }: DebtFormProps) {
  const router = useRouter();

  const [creditorName, setCreditorName] = useState(initial?.creditorName ?? "");
  const [debtType, setDebtType] = useState(initial?.debtType ?? "");
  const [currentBalance, setCurrentBalance] = useState(String(initial?.currentBalance ?? ""));
  const [originalBalance, setOriginalBalance] = useState(String(initial?.originalBalance ?? ""));
  const [interestRate, setInterestRate] = useState(String(initial?.interestRate ?? ""));
  const [minimumPayment, setMinimumPayment] = useState(String(initial?.minimumPayment ?? ""));
  const [paymentDay, setPaymentDay] = useState(String(initial?.paymentDay ?? ""));
  const [isClosed, setIsClosed] = useState(initial?.isClosed ?? false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      creditorName,
      debtType,
      currentBalance: parseFloat(currentBalance),
      originalBalance: originalBalance ? parseFloat(originalBalance) : null,
      interestRate: parseFloat(interestRate),
      minimumPayment: parseFloat(minimumPayment),
      paymentDay: paymentDay ? parseInt(paymentDay, 10) : null,
      ...(mode === "edit" ? { isClosed } : {}),
    };

    const url = mode === "create" ? "/api/debts" : `/api/debts/${initial!.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Ошибка сохранения");
      return;
    }

    router.push("/debts");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Удалить этот долг? Это действие нельзя отменить.")) return;
    setLoading(true);

    const res = await fetch(`/api/debts/${initial!.id}`, { method: "DELETE" });
    setLoading(false);

    if (res.ok) {
      router.push("/debts");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="creditorName">Кредитор</Label>
        <Input
          id="creditorName"
          list="creditors-list"
          placeholder="Название банка или организации"
          value={creditorName}
          onChange={(e) => setCreditorName(e.target.value)}
          required
          className="border-[#e2e8f0]"
        />
        <datalist id="creditors-list">
          {CREDITORS.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      <div className="space-y-2">
        <Label htmlFor="debtType">Тип долга</Label>
        <Select value={debtType} onValueChange={setDebtType} required>
          <SelectTrigger className="border-[#e2e8f0]">
            <SelectValue placeholder="Выберите тип" />
          </SelectTrigger>
          <SelectContent>
            {DEBT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentBalance">Текущий остаток, ₽</Label>
          <Input
            id="currentBalance"
            type="number"
            min="0"
            step="0.01"
            placeholder="100000"
            value={currentBalance}
            onChange={(e) => setCurrentBalance(e.target.value)}
            required
            className="border-[#e2e8f0]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalBalance">Изначальная сумма, ₽ <span className="text-[#64748b] font-normal">(необязательно)</span></Label>
          <Input
            id="originalBalance"
            type="number"
            min="0"
            step="0.01"
            placeholder="150000"
            value={originalBalance}
            onChange={(e) => setOriginalBalance(e.target.value)}
            className="border-[#e2e8f0]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interestRate">Годовая ставка, %</Label>
          <Input
            id="interestRate"
            type="number"
            min="0"
            step="0.01"
            placeholder="18.5"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            required
            className="border-[#e2e8f0]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimumPayment">Мин. платёж, ₽/мес</Label>
          <Input
            id="minimumPayment"
            type="number"
            min="0"
            step="0.01"
            placeholder="5000"
            value={minimumPayment}
            onChange={(e) => setMinimumPayment(e.target.value)}
            required
            className="border-[#e2e8f0]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentDay">День платежа <span className="text-[#64748b] font-normal">(необязательно)</span></Label>
        <Input
          id="paymentDay"
          type="number"
          min="1"
          max="31"
          placeholder="15"
          value={paymentDay}
          onChange={(e) => setPaymentDay(e.target.value)}
          className="border-[#e2e8f0] max-w-32"
        />
      </div>

      {mode === "edit" && (
        <div className="flex items-center gap-3">
          <input
            id="isClosed"
            type="checkbox"
            checked={isClosed}
            onChange={(e) => setIsClosed(e.target.checked)}
            className="h-4 w-4 rounded border-[#e2e8f0] accent-[#059669]"
          />
          <Label htmlFor="isClosed" className="font-normal cursor-pointer text-[#64748b]">
            Долг закрыт (выплачен)
          </Label>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white"
          disabled={loading || !debtType}
        >
          {loading ? "Сохранение..." : mode === "create" ? "Добавить долг" : "Сохранить изменения"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="border-[#e2e8f0]"
        >
          Отмена
        </Button>
        {mode === "edit" && (
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={loading}
            className="ml-auto border-[#e2e8f0] text-red-600 hover:bg-red-50"
          >
            Удалить
          </Button>
        )}
      </div>
    </form>
  );
}
