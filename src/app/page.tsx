import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  TrendingDown,
  Calculator,
  ListTodo,
  Sliders,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E7ECF3] px-4 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="ДолгOFF" width={28} height={28} priority />
            <span className="text-[17px] font-bold text-[#0F172A] tracking-tight">ДолгOFF</span>
          </div>
          <div className="flex gap-2">
            <Button
              render={<Link href="/login" />}
              variant="ghost"
              className="text-[#667085] hover:text-[#0F172A] rounded-xl text-sm"
            >
              Войти
            </Button>
            <Button
              render={<Link href="/register" />}
              className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl px-5 h-9 text-sm font-semibold shadow-sm shadow-[#6C63FF]/25 transition-all duration-200 hover:scale-[1.02]"
            >
              Начать
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F7F8FC] px-4 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#6C63FF]/5 blur-3xl" />
          <div className="absolute top-32 -left-32 w-72 h-72 rounded-full bg-[#5B8DEF]/6 blur-2xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#E7ECF3] text-[#667085] text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A] animate-pulse" />
            Только математика, никаких советов
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[#0F172A] leading-[1.12] tracking-tight">
            Узнайте, когда вы<br />
            <span className="text-[#6C63FF]">выйдете из долгов</span>
          </h1>
          <p className="text-lg text-[#667085] max-w-xl mx-auto leading-relaxed">
            Добавьте кредиты — и получите точный срок погашения, размер переплаты
            и сценарии, которые реально меняют картину.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <Button
              render={<Link href="/register" />}
              className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-[#6C63FF]/25 transition-all duration-200 hover:scale-[1.02]"
            >
              Посчитать бесплатно
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              render={<Link href="/login" />}
              variant="outline"
              className="border-[#E7ECF3] text-[#667085] rounded-xl h-12 text-base hover:bg-[#F7F8FC]"
            >
              Уже есть аккаунт
            </Button>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-5 justify-center pt-1 text-sm text-[#667085]">
            {["Без данных карт", "Бесплатно", "Данные только у вас"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest text-center mb-8">
            Так выглядит ваш дашборд
          </p>
          <div className="bg-[#F7F8FC] rounded-3xl p-6 sm:p-8 border border-[#E7ECF3] shadow-sm">
            {/* Hero card mock */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6C63FF] via-[#7C73FF] to-[#5B8DEF] p-6 text-white mb-4">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border-[24px] border-white/5 pointer-events-none" />
              <p className="text-sm text-white/70 mb-1">Закроешь долги к</p>
              <p className="text-4xl font-bold tracking-tight mb-1.5">январь 2029</p>
              <p className="text-white/60 text-sm mb-4">4 года 2 мес. при текущем плане</p>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F79009]" />
                <span className="text-sm text-white/90">Уйдёт на проценты: <strong>218 400 ₽</strong></span>
              </div>
            </div>
            {/* Scenario cards mock */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-3 border border-[#E7ECF3]">
                <p className="text-[10px] text-[#6C63FF] font-semibold mb-1.5">+2 000 ₽/мес</p>
                <p className="text-sm font-bold text-[#0F172A]">−8 мес.</p>
                <p className="text-[10px] text-[#12B76A]">экономия 31к ₽</p>
              </div>
              <div className="bg-[#6C63FF] rounded-xl p-3 shadow-lg shadow-[#6C63FF]/25 relative">
                <span className="absolute -top-2 left-2 text-[8px] font-bold bg-[#12B76A] text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">Лучший старт</span>
                <p className="text-[10px] text-white/70 font-semibold mb-1.5">+5 000 ₽/мес</p>
                <p className="text-sm font-bold text-white">−1 год 3 мес.</p>
                <p className="text-[10px] text-white/75">экономия 47 200 ₽</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E7ECF3]">
                <p className="text-[10px] text-[#6C63FF] font-semibold mb-1.5">+10 000 ₽/мес</p>
                <p className="text-sm font-bold text-[#0F172A]">−2 года</p>
                <p className="text-[10px] text-[#12B76A]">экономия 88к ₽</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 bg-[#F7F8FC]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Три шага до ясности</h2>
            <p className="text-[#667085] mt-3">Без сложностей и лишних вопросов</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: ListTodo,
                step: "01",
                title: "Добавьте долги",
                desc: "Банк, остаток, ставка, минимальный платёж — за пару минут",
                accent: "#6C63FF",
                bg: "#EEF2FF",
              },
              {
                icon: Calculator,
                step: "02",
                title: "Увидьте картину",
                desc: "Дата выхода, переплата и стоимость текущего плана — сразу",
                accent: "#F79009",
                bg: "#FFFBEB",
              },
              {
                icon: Sliders,
                step: "03",
                title: "Проверьте сценарии",
                desc: "Двигайте ползунок и видите эффект от доплаты мгновенно",
                accent: "#12B76A",
                bg: "#F0FDF8",
              },
            ].map(({ icon: Icon, step, title, desc, accent, bg }) => (
              <div key={step} className="bg-white rounded-2xl border border-[#E7ECF3] p-6 shadow-[0_1px_4px_rgba(15,23,42,0.04)] text-center space-y-3">
                <p className="text-[10px] font-bold tracking-widest" style={{ color: accent }}>{step}</p>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                  style={{ background: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: accent }} />
                </div>
                <h3 className="font-bold text-[#0F172A]">{title}</h3>
                <p className="text-sm text-[#667085] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After example */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Было → Стало</h2>
            <p className="text-[#667085] mt-3">Анонимный пример — три кредита, общий остаток 450 000 ₽</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before */}
            <div className="rounded-2xl border border-[#E7ECF3] bg-[#F7F8FC] p-6">
              <p className="text-xs font-semibold text-[#667085] uppercase tracking-wide mb-4">Без изменений</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#94a3b8]">Срок погашения</p>
                  <p className="text-2xl font-bold text-[#0F172A]">6 лет 4 мес.</p>
                </div>
                <div>
                  <p className="text-xs text-[#94a3b8]">Переплата</p>
                  <p className="text-2xl font-bold text-[#D97706]">210 000 ₽</p>
                </div>
              </div>
            </div>
            {/* After */}
            <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF8] p-6">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-semibold text-[#065f46] uppercase tracking-wide">+5 000 ₽/мес</p>
                <span className="text-[10px] font-bold bg-[#12B76A] text-white px-2 py-0.5 rounded-full">Симулятор</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#065f46]/60">Новый срок</p>
                  <p className="text-2xl font-bold text-[#059669]">4 года 3 мес.</p>
                  <p className="text-xs text-[#12B76A] font-semibold">−2 года 1 мес.</p>
                </div>
                <div>
                  <p className="text-xs text-[#065f46]/60">Переплата</p>
                  <p className="text-2xl font-bold text-[#059669]">163 000 ₽</p>
                  <p className="text-xs text-[#12B76A] font-semibold">экономия 47 000 ₽</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-[#94a3b8] mt-4">
            Пример расчёта. Результат зависит от условий договора.
          </p>
        </div>
      </section>

      {/* Trust block */}
      <section className="px-4 py-20 bg-[#F7F8FC]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-10 text-center space-y-6 border border-[#E7ECF3] shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#6C63FF]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Только математика</h2>
            <p className="text-[#667085] leading-relaxed max-w-md mx-auto">
              Мы не храним данные карт и счетов. Не даём финансовых советов.
              ДолгOFF — это инструмент расчёта, который помогает вам считать, а не решает за вас.
            </p>
            <div className="flex flex-wrap gap-5 justify-center">
              {[
                { icon: Shield, text: "Без данных карт" },
                { icon: Calculator, text: "Только расчёты" },
                { icon: CheckCircle2, text: "Без советов" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-[#667085]">
                  <Icon className="w-4 h-4 text-[#12B76A]" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
            <Zap className="w-7 h-7 text-[#6C63FF]" />
          </div>
          <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">
            Узнайте свой план прямо сейчас
          </h2>
          <p className="text-[#667085]">
            Это займёт 5 минут. Никаких карт и подписок.
          </p>
          <Button
            render={<Link href="/register" />}
            className="bg-[#6C63FF] hover:bg-[#5B54E8] text-white rounded-xl px-10 h-12 text-base font-semibold shadow-lg shadow-[#6C63FF]/25 transition-all duration-200 hover:scale-[1.02]"
          >
            Посчитать бесплатно
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-[#94a3b8]">
            Бесплатно · Без карты · Данные только у вас
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E7ECF3] px-4 py-8 bg-[#F7F8FC]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center text-sm text-[#667085] mb-4">
            <div className="flex items-center gap-2">
              <Image src="/logo-icon.svg" alt="ДолгOFF" width={20} height={20} />
              <span className="font-bold text-[#0F172A]">ДолгOFF</span>
            </div>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-[#0F172A] transition-colors">
                Конфиденциальность
              </Link>
              <Link href="/terms" className="hover:text-[#0F172A] transition-colors">
                Условия
              </Link>
            </div>
          </div>
          <p className="text-xs text-[#94a3b8]">
            ДолгOFF является информационным инструментом и не оказывает финансовых консультационных услуг.
            Все расчёты носят ориентировочный характер. Реальные условия зависят от договора с кредитором.
          </p>
        </div>
      </footer>
    </div>
  );
}
