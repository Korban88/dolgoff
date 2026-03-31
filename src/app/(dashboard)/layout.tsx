import { Sidebar, BottomNav } from "@/components/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-5 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
        <footer className="px-5 md:px-8 py-4 border-t border-[#E7ECF3] bg-white/70">
          <p className="text-xs text-[#94a3b8]">
            ДолгOFF — инструмент для расчётов. Не является финансовой консультацией.
            Результаты носят исключительно информационный характер.
          </p>
        </footer>
      </div>
      <BottomNav />
    </div>
  );
}
