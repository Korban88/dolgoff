"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  const inputStyle = { borderColor: "var(--border-default)" };

  return (
    <div
      className="rounded-[18px] p-8 space-y-6"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="space-y-1">
        <h1
          className="text-[22px] font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Создать аккаунт
        </h1>
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          Начните путь к финансовой ясности
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-[13px] font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-11 rounded-[10px]"
            style={inputStyle}
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-[13px] font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Пароль
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Минимум 8 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="h-11 rounded-[10px]"
            style={inputStyle}
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-[13px] font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Повторите пароль
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="h-11 rounded-[10px]"
            style={inputStyle}
          />
        </div>

        <div className="flex items-start gap-3 py-1">
          <input
            id="consentPD"
            type="checkbox"
            checked={consentPD}
            onChange={(e) => setConsentPD(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded"
            style={{ accentColor: "var(--accent-primary)", borderColor: "var(--border-default)" }}
          />
          <Label
            htmlFor="consentPD"
            className="text-[13px] font-normal leading-snug cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            Я даю согласие на обработку персональных данных в соответствии с{" "}
            <Link
              href="/privacy"
              className="hover:underline underline-offset-2 font-medium"
              style={{ color: "var(--accent-primary)" }}
              target="_blank"
            >
              Политикой конфиденциальности
            </Link>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-[10px] font-semibold text-[14px] transition-all duration-200"
          style={{ background: "var(--accent-primary)", color: "#FFFFFF" }}
          disabled={loading || !consentPD}
        >
          {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
        </Button>

        <p className="text-center text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-semibold transition-colors"
            style={{ color: "var(--accent-primary)" }}
          >
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}
