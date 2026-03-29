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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[#0f172a] text-sm font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="h-11 rounded-xl border-[#e2e8f0] focus:border-[#3b82f6] bg-white"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[#0f172a] text-sm font-medium">Пароль</Label>
        <Input
          id="password"
          type="password"
          placeholder="Минимум 8 символов"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="h-11 rounded-xl border-[#e2e8f0] focus:border-[#3b82f6] bg-white"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl bg-[#1e40af] hover:bg-[#1d3a9e] text-white font-semibold text-base transition-all duration-200"
        disabled={loading}
      >
        {loading ? "Вход..." : "Войти"}
      </Button>

      <p className="text-center text-sm text-[#64748b]">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-[#1e40af] hover:text-[#1d3a9e] font-semibold transition-colors">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Добро пожаловать</h1>
        <p className="text-[#64748b] text-sm">Введите данные для входа в аккаунт</p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
