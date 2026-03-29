import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  TrendingDown,
  Calculator,
  ListTodo,
  Sliders,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">Д</span>
            </div>
            <span className="text-lg font-bold text-[#1e40af] tracking-tight">ДолгOFF</span>
          </div>
          <div className="flex gap-2">
            <Button
              render={<Link href="/login" />}
              variant="ghost"
              className="text-[#64748b] hover:text-[#0f172a] rounded-xl"
            >
              Войти
            </Button>
            <Button
              render={<Link href="/register" />}
              className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl px-5 shadow-sm shadow-blue-200 transition-all duration-200"
            >
              Начать бесплатно
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eff6ff] via-[#f0f7ff] to-white px-4 py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-blue-50/70 blur-2xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center space-y-7">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-[#1e40af] text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Только математика, никаких советов
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] leading-tight tracking-tight">
            Сколько вы переплатите —<br />
            <span className="text-[#1e40af]">и как это сократить</span>
          </h1>
          <p className="text-lg md:text-xl text-[#64748b] max-w-xl mx-auto leading-relaxed">
            ДолгOFF собирает ваши кредиты в одну картину и показывает срок, переплату
            и эффект от изменения сценария погашения.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              render={<Link href="/register" />}
              size="lg"
              className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl px-8 h-12 text-base font-semibold shadow-md shadow-blue-200 transition-all duration-200"
            >
              Посчитать свой сценарий
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              render={<Link href="/login" />}
              size="lg"
              variant="outline"
              className="border-[#e2e8f0] text-[#64748b] rounded-xl h-12 text-base hover:bg-[#f8fafc]"
            >
              Уже есть аккаунт
            </Button>
          </div>
          <div className="flex flex-wrap gap-5 justify-center pt-2 text-sm text-[#64748b]">
            {["Без данных карт", "Бесплатно", "Данные только у вас"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW MOCK ── */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#f8fafc] rounded-3xl p-6 sm:p-8 border border-[#e2e8f0] shadow-sm">
            <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-5 text-center">
              Так выглядит ваш дашборд
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mock outcome cards */}
              <div className="bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] rounded-2xl p-5">
                <p className="text-xs font-semibold text-[#1e40af] mb-2">Вы закроете долги через</p>
                <p className="text-3xl font-bold text-[#0f172a]">4 года 2 мес.</p>
                <p className="text-xs text-[#64748b] mt-2">По текущему плану</p>
              </div>
              <div className="bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] rounded-2xl p-5">
                <p className="text-xs font-semibold text-[#92400e] mb-2">Переплата банкам</p>
                <p className="text-3xl font-bold text-[#78350f]">218 400 ₽</p>
                <p className="text-xs text-[#b45309] mt-2">Сверх текущего долга · 48%</p>
              </div>
            </div>
            <div className="mt-4 bg-gradient-to-r from-[#f0fdf4] to-[#ecfdf5] border border-emerald-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-[#065f46]">Если добавить +5 000 ₽ / мес</p>
              <div className="flex flex-wrap gap-4 mt-1.5">
                <span className="text-lg font-bold text-[#059669]">на 1 год 3 мес. быстрее</span>
                <span className="text-lg font-bold text-[#059669]">экономия 47 200 ₽</span>
              </div>
              <p className="text-xs text-[#64748b] mt-1">Демонстрационный сценарий</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 py-20 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">Как это работает</h2>
            <p className="text-[#64748b] mt-3">Три шага до полной ясности</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ListTodo,
                step: "01",
                title: "Добавьте долги",
                desc: "Банк, остаток, ставка, минимальный платёж — за пару минут",
                color: "bg-blue-50 text-[#1e40af]",
              },
              {
                icon: Calculator,
                step: "02",
                title: "Узнайте переплату",
                desc: "Срок погашения, переплата по процентам, разбивка по кредитам",
                color: "bg-amber-50 text-[#f59e0b]",
              },
              {
                icon: Sliders,
                step: "03",
                title: "Проверьте сценарии",
                desc: "Симулятор показывает эффект от доплаты — сколько времени и денег можно сберечь",
                color: "bg-emerald-50 text-[#059669]",
              },
            ].map(({ icon: Icon, step, title, desc, color }) => (
              <div key={step} className="relative text-center space-y-4">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto shadow-sm`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#cbd5e1] tracking-widest">
                  {step}
                </div>
                <h3 className="font-bold text-lg text-[#0f172a]">{title}</h3>
                <p className="text-sm text-[#64748b] leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMPLE CASE ── */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">Пример расчёта</h2>
            <p className="text-[#64748b] mt-3">Анонимизированный сценарий — только для иллюстрации</p>
          </div>
          <Card className="border-[#e2e8f0] shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-0">
              {/* Case header */}
              <div className="bg-[#f8fafc] px-6 py-5 border-b border-[#e2e8f0]">
                <p className="text-sm font-semibold text-[#0f172a]">Три кредита, общий остаток 450 000 ₽</p>
                <p className="text-xs text-[#64748b] mt-1">Потребительский, кредитная карта, автокредит</p>
              </div>
              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e2e8f0]">
                {[
                  { label: "Без изменений", sub: "Срок", value: "6 лет 4 мес.", color: "text-[#0f172a]" },
                  { label: "Переплата", sub: "По процентам", value: "210 000 ₽", color: "text-[#f59e0b]" },
                  { label: "+5 000 ₽/мес", sub: "Срок сократился на", value: "2 года 1 мес.", color: "text-[#059669]" },
                ].map(({ label, sub, value, color }) => (
                  <div key={label} className="px-6 py-5">
                    <p className="text-xs text-[#94a3b8] font-medium">{sub}</p>
                    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                    <p className="text-xs text-[#64748b] mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <p className="text-xs text-center text-[#94a3b8] mt-4">
            Это пример расчёта. Результат зависит от исходных данных и условий договора.
          </p>
        </div>
      </section>

      {/* ── WHAT YOU LEARN ── */}
      <section className="px-4 py-20 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">Что вы увидите</h2>
            <p className="text-[#64748b] mt-3">Всё, чтобы принять взвешенное решение</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Calculator,
                title: "Дата выхода из долгов",
                desc: "Когда именно вы закроете последний кредит при текущем плане платежей",
                bg: "bg-blue-50",
                iconColor: "text-[#1e40af]",
              },
              {
                icon: TrendingDown,
                title: "Переплата по процентам",
                desc: "Сколько вы заплатите сверх долга — и насколько это можно сократить",
                bg: "bg-amber-50",
                iconColor: "text-[#f59e0b]",
              },
              {
                icon: Sliders,
                title: "Симулятор доплат",
                desc: "Как дополнительные 5 000 ₽ в месяц меняют срок и переплату — мгновенный расчёт",
                bg: "bg-emerald-50",
                iconColor: "text-[#059669]",
              },
              {
                icon: Shield,
                title: "Сравнение стратегий",
                desc: "Лавина, снежный ком, пропорционально — что даёт меньшую переплату для ваших долгов",
                bg: "bg-violet-50",
                iconColor: "text-violet-600",
              },
            ].map(({ icon: Icon, title, desc, bg, iconColor }) => (
              <Card
                key={title}
                className="border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl"
              >
                <CardContent className="pt-6 pb-5 flex gap-4">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f172a] mb-1.5">{title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BLOCK ── */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#eff6ff] to-[#f0fdf4] rounded-3xl p-10 text-center space-y-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-[#0f172a]">Только математика — никаких обещаний</h2>
            <p className="text-[#64748b] leading-relaxed max-w-xl mx-auto">
              Мы не храним данные карт и счетов. Не даём финансовых советов и не обещаем результатов.
              ДолгOFF — это инструмент расчёта, который помогает вам считать, а не решает за вас.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              {[
                { icon: Shield, text: "Без данных карт" },
                { icon: Calculator, text: "Только расчёты" },
                { icon: CheckCircle2, text: "Без советов" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-[#64748b]">
                  <Icon className="w-4 h-4 text-[#059669]" />
                  {text}
                </div>
              ))}
            </div>
            <Button
              render={<Link href="/register" />}
              size="lg"
              className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl px-8 h-12 text-base font-semibold shadow-md shadow-blue-200 transition-all duration-200 mt-2"
            >
              Посчитать свой сценарий
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#e2e8f0] px-4 py-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center text-sm text-[#64748b] mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center">
                <span className="text-white font-bold text-xs">Д</span>
              </div>
              <span className="font-bold text-[#1e40af]">ДолгOFF</span>
            </div>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-[#0f172a] transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="hover:text-[#0f172a] transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
          <p className="text-xs text-[#94a3b8]">
            ДолгOFF является информационным инструментом и не оказывает финансовых
            консультационных услуг. Все расчёты носят ориентировочный характер.
            Реальные условия зависят от договора с кредитором.
          </p>
        </div>
      </footer>
    </div>
  );
}
