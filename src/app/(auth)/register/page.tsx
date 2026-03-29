"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consentPD, setConsentPD] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!consentPD) {
      setError("Необходимо дать согласие на обработку персональных данных");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, consentPD }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Ошибка регистрации. Попробуйте позже.");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <Card className="w-full max-w-md shadow-sm border-[#e2e8f0]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-[#0f172a]">Регистрация в ДолгOFF</CardTitle>
        <CardDescription className="text-[#64748b]">
          Создайте аккаунт, чтобы начать работу с долгами
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#0f172a]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="border-[#e2e8f0]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#0f172a]">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="Минимум 8 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="border-[#e2e8f0]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-[#0f172a]">Повторите пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="border-[#e2e8f0]"
            />
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input
              id="consentPD"
              type="checkbox"
              checked={consentPD}
              onChange={(e) => setConsentPD(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#e2e8f0] accent-[#1e40af]"
            />
            <Label htmlFor="consentPD" className="text-sm text-[#64748b] font-normal leading-snug cursor-pointer">
              Я даю согласие на обработку персональных данных в соответствии с{" "}
              <Link href="/privacy" className="text-[#1e40af] hover:underline" target="_blank">
                Политикой конфиденциальности
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1e40af] hover:bg-[#1d3a9e] text-white"
            disabled={loading || !consentPD}
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>

          <p className="text-center text-sm text-[#64748b]">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[#1e40af] hover:underline font-medium">
              Войти
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
