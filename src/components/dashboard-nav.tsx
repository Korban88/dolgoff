"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, CreditCard, Sliders, Settings, LogOut,
  BookOpen, Sun, Moon, Menu, X,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { href: "/dashboard",  label: "Дашборд",      icon: LayoutDashboard },
  { href: "/debts",      label: "Мои долги",     icon: CreditCard },
  { href: "/simulator",  label: "Симулятор",     icon: Sliders },
  { href: "/learn",      label: "Разобраться",   icon: BookOpen },
  { href: "/settings",   label: "Настройки",     icon: Settings },
];

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        background: "var(--accent-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ color: "#fff", fontWeight: 800, fontSize: Math.round(size * 0.52), lineHeight: 1, letterSpacing: "-0.01em" }}>
        Д
      </span>
    </div>
  );
}

function NavItems({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className="nav-item flex items-center gap-3 text-[14px] transition-all duration-150"
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              background: active ? "var(--sidebar-active-bg)" : "transparent",
              color: active ? "var(--sidebar-active-text)" : "var(--text-secondary)",
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
                color: active ? "var(--accent-primary)" : "var(--text-tertiary)",
              }}
            />
            {label}
          </Link>
        );
      })}
    </>
  );
}

function BottomActions({ onNavigate }: { onNavigate?: () => void }) {
  const { theme, toggle } = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <button
        onClick={toggle}
        className="flex items-center gap-3 w-full text-[14px] transition-all duration-150"
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          color: "var(--text-secondary)",
          fontWeight: 500,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {theme === "dark" ? (
          <Sun style={{ width: "20px", height: "20px", flexShrink: 0, strokeWidth: 1.5, color: "var(--text-tertiary)" }} />
        ) : (
          <Moon style={{ width: "20px", height: "20px", flexShrink: 0, strokeWidth: 1.5, color: "var(--text-tertiary)" }} />
        )}
        {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      </button>
      <button
        onClick={() => { onNavigate?.(); signOut({ callbackUrl: "/" }); }}
        className="nav-signout flex items-center gap-3 w-full text-[14px] transition-all duration-150"
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          color: "var(--text-tertiary)",
          fontWeight: 500,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <LogOut style={{ width: "20px", height: "20px", flexShrink: 0, strokeWidth: 1.5 }} />
        Выйти
      </button>
    </div>
  );
}

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
        className="flex items-center gap-2.5"
        style={{ padding: "24px 20px 20px" }}
      >
        <LogoMark size={32} />
        <span
          style={{
            color: "var(--text-primary)",
            fontSize: "20px",
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
        <NavItems pathname={pathname} />
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 12px 24px" }}>
        <BottomActions />
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between"
        style={{
          height: "56px",
          padding: "0 16px",
          background: "var(--surface-card)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoMark size={26} />
          <span style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            ДолгOFF
          </span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <Menu style={{ width: "18px", height: "18px", strokeWidth: 2 }} />
        </button>
      </header>

      {/* Drawer backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="md:hidden fixed top-0 left-0 bottom-0 z-50 flex flex-col"
        style={{
          width: "280px",
          background: "var(--surface-card)",
          borderRight: "1px solid var(--border-subtle)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <LogoMark size={28} />
            <span style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-primary)" }}>
              ДолгOFF
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-input)",
              border: "1px solid var(--border-card)",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
          >
            <X style={{ width: "16px", height: "16px", strokeWidth: 2 }} />
          </button>
        </div>

        {/* Nav */}
        <nav
          className="flex flex-col flex-1 overflow-y-auto"
          style={{ padding: "8px 12px 0", gap: "2px" }}
        >
          <NavItems pathname={pathname} onNavigate={() => setOpen(false)} />
        </nav>

        {/* Bottom */}
        <div style={{ padding: "12px 12px 32px", borderTop: "1px solid var(--border-subtle)" }}>
          <BottomActions onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}
