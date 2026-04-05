import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Calculator,
  ListTodo,
  Sliders,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-page)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-4 py-3.5"
        style={{
          background: "rgba(248,249,251,0.90)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-[8px] flex items-center justify-center"
              style={{ background: "var(--accent-primary)" }}
            >
              <span className="text-white font-bold text-[12px]">Д</span>
            </div>
            <span
              className="text-[17px] font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              ДолгOFF
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              nativeButton={false} render={<Link href="/login" />}
              variant="ghost"
              className="rounded-[10px] text-[13px]"
              style={{ color: "var(--text-secondary)" }}
            >
              Войти
            </Button>
            <Button
              nativeButton={false} render={<Link href="/register" />}
              className="rounded-[10px] px-5 h-9 text-[13px] font-semibold transition-all duration-200"
              style={{ background: "var(--accent-primary)", color: "#FFFFFF" }}
            >
              Начать
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 text-[12px] font-semibold px-4 py-1.5 rounded-full"
            style={{
              background: "var(--accent-primary-light)",
              border: "1px solid rgba(108,92,231,0.20)",
              color: "var(--accent-primary)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--accent-primary)" }}
            />
            Только математика, никаких советов
          </div>

          {/* Headline */}
          <h1
            className="text-[42px] md:text-[54px] font-bold leading-[1.08] tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Узнайте, когда вы<br />
            <span style={{ color: "var(--accent-primary)" }}>выйдете из долгов</span>
          </h1>
          <p
            className="text-[16px] max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Добавьте кредиты — и получите точный срок погашения, размер переплаты
            и сценарии, которые реально меняют картину.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <Button
              nativeButton={false} render={<Link href="/register" />}
              className="rounded-[12px] px-8 h-12 text-[15px] font-semibold transition-all duration-200"
              style={{ background: "var(--accent-primary)", color: "#FFFFFF", boxShadow: "0 4px 16px rgba(108,92,231,0.35)" }}
            >
              Посчитать бесплатно
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              nativeButton={false} render={<Link href="/login" />}
              variant="outline"
              className="rounded-[12px] h-12 text-[15px]"
              style={{
                border: "1px solid var(--border-default)",
                background: "var(--bg-surface)",
                color: "var(--text-secondary)",
              }}
            >
              Уже есть аккаунт
            </Button>
          </div>

          {/* Trust chips */}
          <div
            className="flex flex-wrap gap-5 justify-center pt-1 text-[13px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {["Без данных карт", "Бесплатно", "Данные только у вас"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: "var(--color-success)" }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section
        className="px-4 py-16"
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-center mb-8"
            style={{ color: "var(--text-tertiary)" }}
          >
            Так выглядит ваш дашборд
          </p>
          <div
            className="rounded-[20px] p-6 sm:p-8"
            style={{ background: "var(--bg-page)", border: "1px solid var(--border-light)" }}
          >
            {/* Hero card mock — purple gradient */}
            <div
              className="relative overflow-hidden rounded-[18px] p-6 mb-4"
              style={{
                background: "linear-gradient(135deg, #6C5CE7 0%, #8B7CF7 55%, #A78BFA 100%)",
                boxShadow: "0 8px 32px rgba(108,92,231,0.30)",
              }}
            >
              <p
                className="text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-1"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Закроешь долги к
              </p>
              <p
                className="font-bold tabular-nums mb-1.5"
                style={{ fontSize: "36px", letterSpacing: "-0.03em", color: "#FFFFFF" }}
              >
                январь 2029
              </p>
              <p className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
                4 года 2 мес. при текущем плане
              </p>
              <div
                className="inline-flex items-center gap-2 rounded-[12px] px-3 py-1.5"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
              >
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.80)" }}>
                  Переплата: <strong className="text-white">218 400 ₽</strong>
                </span>
              </div>
            </div>
            {/* Scenario cards mock */}
            <div className="grid grid-cols-3 gap-3">
              <div
                className="rounded-[14px] p-3"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}
              >
                <p className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  +2 000 ₽/мес
                </p>
                <p className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>−8 мес.</p>
                <p className="text-[10px]" style={{ color: "var(--color-success)" }}>экономия 31к ₽</p>
              </div>
              <div
                className="rounded-[14px] p-3 relative"
                style={{
                  background: "var(--accent-primary)",
                  boxShadow: "0 4px 16px rgba(108,92,231,0.35)",
                }}
              >
                <span
                  className="absolute -top-2 left-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: "#10B981", color: "#FFFFFF" }}
                >
                  Лучший старт
                </span>
                <p
                  className="text-[10px] font-semibold mb-1.5"
                  style={{ color: "rgba(255,255,255,0.60)" }}
                >
                  +5 000 ₽/мес
                </p>
                <p className="text-[13px] font-bold text-white">−1 год 3 мес.</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.75)" }}>
                  экономия 47 200 ₽
                </p>
              </div>
              <div
                className="rounded-[14px] p-3"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}
              >
                <p className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--text-tertiary)" }}>
                  +10 000 ₽/мес
                </p>
                <p className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>−2 года</p>
                <p className="text-[10px]" style={{ color: "var(--color-success)" }}>экономия 88к ₽</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20" style={{ background: "var(--bg-page)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-[30px] font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Три шага до ясности
            </h2>
            <p className="mt-3 text-[14px]" style={{ color: "var(--text-tertiary)" }}>
              Без сложностей и лишних вопросов
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: ListTodo,
                step: "01",
                title: "Добавьте долги",
                desc: "Банк, остаток, ставка, минимальный платёж — за пару минут",
                color: "var(--accent-primary)",
                bg: "var(--accent-primary-light)",
              },
              {
                icon: Calculator,
                step: "02",
                title: "Увидите картину",
                desc: "Дата выхода, переплата и стоимость текущего плана — сразу",
                color: "var(--color-success)",
                bg: "var(--color-success-light)",
              },
              {
                icon: Sliders,
                step: "03",
                title: "Проверьте сценарии",
                desc: "Двигайте ползунок и видите эффект от доплаты мгновенно",
                color: "var(--color-warning)",
                bg: "rgba(245,158,11,0.08)",
              },
            ].map(({ icon: Icon, step, title, desc, color, bg }) => (
              <div
                key={step}
                className="rounded-[18px] p-6 text-center space-y-3"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <p
                  className="text-[10.5px] font-bold tracking-[0.10em] uppercase"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {step}
                </p>
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center mx-auto"
                  style={{ background: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3
                  className="font-bold text-[15px]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After example */}
      <section
        className="px-4 py-20"
        style={{
          background: "var(--bg-surface)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2
              className="text-[30px] font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Было → Стало
            </h2>
            <p className="mt-3 text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              Анонимный пример — три кредита, общий остаток 450 000 ₽
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before */}
            <div
              className="rounded-[18px] p-6"
              style={{
                background: "var(--bg-page)",
                border: "1px solid var(--border-light)",
              }}
            >
              <p
                className="text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-4"
                style={{ color: "var(--text-tertiary)" }}
              >
                Без изменений
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    Срок погашения
                  </p>
                  <p
                    className="text-[26px] font-bold tabular-nums"
                    style={{ letterSpacing: "-0.03em", color: "var(--text-primary)" }}
                  >
                    6 лет 4 мес.
                  </p>
                </div>
                <div>
                  <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                    Переплата
                  </p>
                  <p
                    className="text-[26px] font-bold tabular-nums"
                    style={{ letterSpacing: "-0.03em", color: "var(--color-warning)" }}
                  >
                    210 000 ₽
                  </p>
                </div>
              </div>
            </div>
            {/* After */}
            <div
              className="rounded-[18px] p-6"
              style={{
                background: "var(--color-success-light)",
                border: "1px solid rgba(16,185,129,0.25)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <p
                  className="text-[10.5px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: "var(--color-success)" }}
                >
                  +5 000 ₽/мес
                </p>
                <span
                  className="badge-pill text-[10px] font-bold"
                  style={{ background: "var(--color-success)", color: "#FFFFFF" }}
                >
                  Симулятор
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px]" style={{ color: "rgba(5,150,105,0.60)" }}>
                    Новый срок
                  </p>
                  <p
                    className="text-[26px] font-bold tabular-nums"
                    style={{ letterSpacing: "-0.03em", color: "var(--color-success)" }}
                  >
                    4 года 3 мес.
                  </p>
                  <p
                    className="text-[11px] font-semibold"
                    style={{ color: "var(--color-success)" }}
                  >
                    −2 года 1 мес.
                  </p>
                </div>
                <div>
                  <p className="text-[11px]" style={{ color: "rgba(5,150,105,0.60)" }}>
                    Переплата
                  </p>
                  <p
                    className="text-[26px] font-bold tabular-nums"
                    style={{ letterSpacing: "-0.03em", color: "var(--color-success)" }}
                  >
                    163 000 ₽
                  </p>
                  <p
                    className="text-[11px] font-semibold"
                    style={{ color: "var(--color-success)" }}
                  >
                    экономия 47 000 ₽
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p
            className="text-[11px] text-center mt-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            Пример расчёта. Результат зависит от условий договора.
          </p>
        </div>
      </section>

      {/* Trust block */}
      <section className="px-4 py-20" style={{ background: "var(--bg-page)" }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-[20px] p-10 text-center space-y-6"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              className="w-14 h-14 mx-auto rounded-[14px] flex items-center justify-center"
              style={{ background: "var(--accent-primary-light)" }}
            >
              <Shield className="w-7 h-7" style={{ color: "var(--accent-primary)" }} />
            </div>
            <h2
              className="text-[24px] font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Только математика
            </h2>
            <p
              className="leading-relaxed max-w-md mx-auto text-[14px]"
              style={{ color: "var(--text-secondary)" }}
            >
              Мы не храним данные карт и счетов. Не даём финансовых советов.
              ДолгOFF — это инструмент расчёта, который помогает вам считать, а не решает за вас.
            </p>
            <div className="flex flex-wrap gap-5 justify-center">
              {[
                { icon: Shield, text: "Без данных карт" },
                { icon: Calculator, text: "Только расчёты" },
                { icon: CheckCircle2, text: "Без советов" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-[13px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "var(--color-success)" }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="px-4 py-20"
        style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-light)" }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div
            className="w-14 h-14 mx-auto rounded-[14px] flex items-center justify-center"
            style={{ background: "var(--accent-primary-light)" }}
          >
            <Zap className="w-7 h-7" style={{ color: "var(--accent-primary)" }} />
          </div>
          <h2
            className="text-[30px] font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Узнайте свой план прямо сейчас
          </h2>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            Это займёт 5 минут. Никаких карт и подписок.
          </p>
          <Button
            nativeButton={false} render={<Link href="/register" />}
            className="rounded-[12px] px-10 h-12 text-[15px] font-semibold transition-all duration-200"
            style={{
              background: "var(--accent-primary)",
              color: "#FFFFFF",
              boxShadow: "0 4px 16px rgba(108,92,231,0.35)",
            }}
          >
            Посчитать бесплатно
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            Бесплатно · Без карты · Данные только у вас
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-4 py-8"
        style={{ borderTop: "1px solid var(--border-light)", background: "var(--bg-page)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div
            className="flex flex-wrap gap-4 justify-between items-center text-[13px] mb-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-[7px] flex items-center justify-center"
                style={{ background: "var(--accent-primary)" }}
              >
                <span className="text-white font-bold text-[11px]">Д</span>
              </div>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>ДолгOFF</span>
            </div>
            <div className="flex gap-5">
              <Link
                href="/privacy"
                className="transition-colors hover:opacity-80"
                style={{ color: "var(--text-tertiary)" }}
              >
                Конфиденциальность
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:opacity-80"
                style={{ color: "var(--text-tertiary)" }}
              >
                Условия
              </Link>
            </div>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            ДолгOFF является информационным инструментом и не оказывает финансовых консультационных услуг.
            Все расчёты носят ориентировочный характер. Реальные условия зависят от договора с кредитором.
          </p>
        </div>
      </footer>
    </div>
  );
}
