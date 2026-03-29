"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CreditCard, Sliders, Settings, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/debts", label: "Мои долги", icon: CreditCard },
  { href: "/simulator", label: "Симулятор", icon: Sliders },
  { href: "/settings", label: "Настройки", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[#e8edf4] bg-white min-h-screen py-6 px-4">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-xs">Д</span>
        </div>
        <span className="text-lg font-bold text-[#0f172a] tracking-tight group-hover:text-[#1e40af] transition-colors">
          ДолгOFF
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#eff6ff] text-[#1e40af] shadow-sm"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                active ? "bg-[#dbeafe]" : "bg-[#f1f5f9] group-hover:bg-[#e8edf4]"
              }`}>
                <Icon className={`w-4 h-4 ${active ? "text-[#1e40af]" : "text-[#64748b]"}`} />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748b] hover:bg-[#fef2f2] hover:text-[#dc2626] transition-all duration-150 mt-2"
      >
        <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center shrink-0">
          <LogOut className="w-4 h-4" />
        </div>
        Выйти
      </button>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#e8edf4] flex z-10 pb-safe">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              active ? "text-[#1e40af]" : "text-[#94a3b8]"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              active ? "bg-[#eff6ff]" : ""
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
