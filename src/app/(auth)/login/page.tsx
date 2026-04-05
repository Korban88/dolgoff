"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Неверный email или пароль");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  const inputStyle = { borderColor: "var(--border-default)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          autoComplete="current-password"
          className="h-11 rounded-[10px]"
          style={inputStyle}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-[10px] font-semibold text-[14px] transition-all duration-200"
        style={{ background: "var(--accent-primary)", color: "#FFFFFF" }}
        disabled={loading}
      >
        {loading ? "Вход..." : "Войти"}
      </Button>

      <p className="text-center text-[13px]" style={{ color: "var(--text-secondary)" }}>
        Нет аккаунта?{" "}
        <Link
          href="/register"
          className="font-semibold transition-colors"
          style={{ color: "var(--accent-primary)" }}
        >
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
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
          Добро пожаловать
        </h1>
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          Введите данные для входа в аккаунт
        </p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
