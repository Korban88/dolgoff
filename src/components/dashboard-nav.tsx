"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CreditCard, Sliders, Settings, LogOut, BookOpen } from "lucide-react";

const navItems = [
  { href: "/dashboard",  label: "Дашборд",   icon: LayoutDashboard },
  { href: "/debts",      label: "Мои долги",  icon: CreditCard },
  { href: "/simulator",  label: "Симулятор",  icon: Sliders },
  { href: "/learn",      label: "Разобраться", icon: BookOpen },
  { href: "/settings",   label: "Настройки",  icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[#E7ECF3] bg-white min-h-screen py-6 px-4">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-8 group">
        <Image
          src="/logo-icon.svg"
          alt="ДолгOFF"
          width={32}
          height={32}
          className="shrink-0"
          priority
        />
        <span className="text-[17px] font-bold text-[#0F172A] tracking-tight group-hover:text-[#6C63FF] transition-colors">
          ДолгOFF
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-[#EEF2FF] text-[#6C63FF]"
                  : "text-[#667085] hover:bg-[#F7F8FC] hover:text-[#0F172A]"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                active ? "bg-[#6C63FF]/10" : "bg-[#F7F8FC]"
              }`}>
                <Icon className={`w-4 h-4 ${active ? "text-[#6C63FF]" : "text-[#667085]"}`} />
              </div>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#667085] hover:bg-red-50 hover:text-red-600 transition-all duration-150 mt-2"
      >
        <div className="w-8 h-8 rounded-xl bg-[#F7F8FC] flex items-center justify-center shrink-0">
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#E7ECF3] flex z-10 pb-safe">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              active ? "text-[#6C63FF]" : "text-[#94a3b8]"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              active ? "bg-[#EEF2FF]" : ""
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
