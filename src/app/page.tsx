import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BarChart2, TrendingDown, Shield, ArrowRight, CheckCircle2, ListTodo, PieChart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e2e8f0] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-[#1e40af] tracking-tight">ДолгOFF</span>
          <div className="flex gap-2">
            <Button render={<Link href="/login" />} variant="ghost" className="text-[#64748b] hover:text-[#0f172a] rounded-xl">
              Войти
            </Button>
            <Button render={<Link href="/register" />} className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl px-5 shadow-sm shadow-blue-200 transition-all duration-200">
              Начать бесплатно
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eff6ff] via-[#f0f7ff] to-white px-4 py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-blue-50/60 blur-2xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 text-[#1e40af] text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            Только математика, никаких советов
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] leading-tight tracking-tight">
            Узнайте, когда вы<br />
            <span className="text-[#1e40af]">закроете все долги</span>
          </h1>
          <p className="text-lg md:text-xl text-[#64748b] max-w-xl mx-auto leading-relaxed">
            Добавьте кредиты, увидьте полную картину и сравните стратегии погашения.
            Без стресса — только цифры.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button render={<Link href="/register" />} size="lg" className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl px-8 h-12 text-base font-semibold shadow-md shadow-blue-200 transition-all duration-200">
              Попробовать бесплатно
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button render={<Link href="/login" />} size="lg" variant="outline" className="border-[#e2e8f0] text-[#64748b] rounded-xl h-12 text-base hover:bg-[#f8fafc]">
              Уже есть аккаунт
            </Button>
          </div>
          {/* Mini trust badges */}
          <div className="flex flex-wrap gap-5 justify-center pt-4 text-sm text-[#64748b]">
            {["Без данных карт", "Бесплатно", "Данные только у вас"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">Как это работает</h2>
            <p className="text-[#64748b] mt-3">Три простых шага до финансовой ясности</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ListTodo,
                step: "01",
                title: "Внесите долги",
                desc: "Добавьте все кредиты: банк, остаток, ставку и минимальный платёж",
                color: "bg-blue-50 text-[#1e40af]",
              },
              {
                icon: PieChart,
                step: "02",
                title: "Получите картину",
                desc: "Увидите общий долг, переплату по процентам и дату выхода",
                color: "bg-emerald-50 text-[#059669]",
              },
              {
                icon: TrendingDown,
                step: "03",
                title: "Выберите стратегию",
                desc: "Сравните методы и найдите самый выгодный план погашения",
                color: "bg-amber-50 text-[#f59e0b]",
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

      {/* Features */}
      <section className="px-4 py-20 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">Что вы узнаете</h2>
            <p className="text-[#64748b] mt-3">Всё необходимое для принятия взвешенного решения</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: Calculator,
                title: "Точная дата выхода",
                desc: "Когда именно вы закроете последний кредит при текущем плане платежей",
                bg: "bg-blue-50",
                iconColor: "text-[#1e40af]",
              },
              {
                icon: TrendingDown,
                title: "Переплата по процентам",
                desc: "Сколько вы заплатите сверх долга — и как сократить эту сумму",
                bg: "bg-amber-50",
                iconColor: "text-[#f59e0b]",
              },
              {
                icon: BarChart2,
                title: "Сравнение стратегий",
                desc: "Какая стратегия даёт максимальную экономию для вашего профиля долгов",
                bg: "bg-emerald-50",
                iconColor: "text-[#059669]",
              },
              {
                icon: Shield,
                title: "Симулятор доплат",
                desc: "Как дополнительные 5 000 ₽ в месяц меняют всю картину и экономят годы",
                bg: "bg-violet-50",
                iconColor: "text-violet-600",
              },
            ].map(({ icon: Icon, title, desc, bg, iconColor }) => (
              <Card key={title} className="border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl">
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

      {/* Trust block */}
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
            <Button render={<Link href="/register" />} size="lg" className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl px-8 h-12 text-base font-semibold shadow-md shadow-blue-200 transition-all duration-200 mt-2">
              Начать бесплатно
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0] px-4 py-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center text-sm text-[#64748b] mb-4">
            <span className="font-bold text-[#1e40af]">ДолгOFF</span>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-[#0f172a] transition-colors">Политика конфиденциальности</Link>
              <Link href="/terms" className="hover:text-[#0f172a] transition-colors">Условия использования</Link>
            </div>
          </div>
          <p className="text-xs text-[#64748b]">
            ДолгOFF является информационным инструментом и не оказывает финансовых консультационных услуг.
            Все расчёты носят ориентировочный характер. Реальные условия зависят от договора с кредитором.
          </p>
        </div>
      </footer>
    </div>
  );
}
