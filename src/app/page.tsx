import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, BarChart2, TrendingDown, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-[#1e40af]">ДолгOFF</span>
          <div className="flex gap-3">
            <Button render={<Link href="/login" />} variant="ghost" className="text-[#64748b] hover:text-[#0f172a]">
              Войти
            </Button>
            <Button render={<Link href="/register" />} className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white">
              Начать бесплатно
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight">
            Узнайте, когда вы закроете<br />все долги
          </h1>
          <p className="text-lg text-[#64748b] max-w-xl mx-auto">
            Соберите все кредиты в одном месте. Увидьте полную картину.
            Сравните стратегии погашения и найдите самый выгодный путь.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button render={<Link href="/register" />} size="lg" className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white px-8">
              Попробовать бесплатно
            </Button>
            <Button render={<Link href="/login" />} size="lg" variant="outline" className="border-[#e2e8f0] text-[#64748b]">
              Уже есть аккаунт
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#0f172a] mb-10">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Внесите долги", desc: "Добавьте все кредиты: банк, сумму, ставку, минимальный платёж" },
              { step: "2", title: "Получите картину", desc: "Увидите общий долг, переплату по процентам и дату выхода" },
              { step: "3", title: "Выберите стратегию", desc: "Сравните методы лавины, снежного кома и пропорционального погашения" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#eff6ff] text-[#1e40af] font-bold text-lg flex items-center justify-center mx-auto">
                  {step}
                </div>
                <h3 className="font-semibold text-[#0f172a]">{title}</h3>
                <p className="text-sm text-[#64748b]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#0f172a] mb-10">Что вы узнаете</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Calculator, title: "Точная дата выхода", desc: "Когда именно вы закроете последний кредит при текущем плане платежей" },
              { icon: TrendingDown, title: "Переплата по процентам", desc: "Сколько вы заплатите сверх долга — и как это сократить" },
              { icon: BarChart2, title: "Сравнение стратегий", desc: "Какая стратегия даёт максимальную экономию конкретно для вашего профиля" },
              { icon: Shield, title: "Симулятор доплат", desc: "Как дополнительные 5000₽ в месяц меняют всю картину" },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-[#e2e8f0]">
                <CardContent className="pt-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#1e40af]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f172a] mb-1">{title}</h3>
                    <p className="text-sm text-[#64748b]">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust block */}
      <section className="bg-white px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#0f172a]">Только математика</h2>
          <p className="text-[#64748b]">
            Мы не храним данные карт и счетов. Не даём финансовых советов.
            ДолгOFF — это калькулятор, который помогает вам считать, а не принимает решения за вас.
          </p>
          <div className="flex flex-wrap gap-6 justify-center pt-4">
            {["Без данных карт", "Без советов", "Только расчёты"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#64748b]">
                <span className="w-2 h-2 rounded-full bg-[#059669]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0] px-4 py-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-between items-center text-sm text-[#64748b] mb-4">
            <span className="font-semibold text-[#1e40af]">ДолгOFF</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-[#0f172a]">Политика конфиденциальности</Link>
              <Link href="/terms" className="hover:text-[#0f172a]">Условия использования</Link>
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
