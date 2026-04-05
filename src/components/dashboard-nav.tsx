"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CreditCard, Sliders, Settings, LogOut, BookOpen } from "lucide-react";

const navItems = [
  { href: "/dashboard",  label: "Дашборд",      icon: LayoutDashboard },
  { href: "/debts",      label: "Мои долги",     icon: CreditCard },
  { href: "/simulator",  label: "Симулятор",     icon: Sliders },
  { href: "/learn",      label: "Разобраться",   icon: BookOpen },
  { href: "/settings",   label: "Настройки",     icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 min-h-screen"
      style={{
        width: "260px",
        background: "var(--surface-card)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center"
        style={{ padding: "24px 20px 20px" }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "-0.025em",
          }}
        >
          ДолгOFF
        </span>
      </Link>

      {/* Nav */}
      <nav
        className="flex flex-col flex-1"
        style={{ padding: "4px 12px 0", gap: "2px" }}
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="nav-item flex items-center gap-3 text-[14px] transition-all duration-150"
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                background: active ? "rgba(163,230,53,0.08)" : "transparent",
                color: active ? "#FFFFFF" : "#8A8A8A",
                fontWeight: active ? 600 : 500,
              }}
              data-active={active ? "true" : undefined}
            >
              <Icon
                style={{
                  width: "20px",
                  height: "20px",
                  flexShrink: 0,
                  strokeWidth: 1.5,
                  color: active ? "#B5F562" : "#555555",
                }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: "12px 12px 24px" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="nav-signout flex items-center gap-3 w-full text-[14px] transition-all duration-150"
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            color: "#555555",
            fontWeight: 500,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <LogOut style={{ width: "20px", height: "20px", flexShrink: 0, strokeWidth: 1.5 }} />
          Выйти
        </button>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 flex z-10 pb-safe"
      style={{
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
            style={{ color: active ? "#B5F562" : "#555555" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: active ? "rgba(163,230,53,0.08)" : "transparent" }}
            >
              <Icon style={{ width: "20px", height: "20px", strokeWidth: 1.5 }} />
            </div>
            <span className="text-[9px] font-semibold" style={{ letterSpacing: "0.01em" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
