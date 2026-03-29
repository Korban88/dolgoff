"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CreditCard, Sliders, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/debts", label: "Мои долги", icon: CreditCard },
  { href: "/simulator", label: "Симулятор", icon: Sliders },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-[#e2e8f0] bg-white min-h-screen py-6 px-3">
      <Link href="/dashboard" className="px-3 mb-8">
        <span className="text-xl font-bold text-[#1e40af]">ДолгOFF</span>
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#eff6ff] text-[#1e40af]"
                  : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a] transition-colors mt-auto"
      >
        <LogOut className="w-4 h-4" />
        Выйти
      </button>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2e8f0] flex z-10">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              active ? "text-[#1e40af]" : "text-[#64748b]"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
