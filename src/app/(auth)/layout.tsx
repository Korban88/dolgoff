export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left motivational panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-12 text-white">
        <div>
          <span className="text-2xl font-bold tracking-tight">ДолгOFF</span>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold leading-snug">
            Первый шаг<br />к финансовой ясности
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
            Соберите все долги в одном месте и увидьте чёткий путь к свободе. Только цифры — без стресса.
          </p>
          <div className="space-y-3 pt-2">
            {[
              "Расчёт всех стратегий погашения",
              "Точная дата закрытия каждого долга",
              "Симулятор доплат и экономии",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-blue-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-xs">
          Инструмент для расчётов. Не является финансовой консультацией.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 bg-[#f8fafc]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <span className="text-xl font-bold text-[#1e40af]">ДолгOFF</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
