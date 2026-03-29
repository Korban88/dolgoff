import { Sidebar, BottomNav } from "@/components/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </main>
        <footer className="px-4 md:px-8 py-4 border-t border-[#e2e8f0] bg-white">
          <p className="text-xs text-[#64748b]">
            ДолгOFF — инструмент для расчётов. Не является финансовой консультацией.
            Результаты носят исключительно информационный характер.
          </p>
        </footer>
      </div>
      <BottomNav />
    </div>
  );
}
