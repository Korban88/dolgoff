"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Trash2, CheckCircle2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPwError("Новые пароли не совпадают");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Новый пароль должен быть не менее 8 символов");
      return;
    }

    setPwLoading(true);
    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setPwLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setPwError(data.error ?? "Ошибка смены пароля");
      return;
    }

    setPwSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "УДАЛИТЬ") {
      setDeleteError("Введите УДАЛИТЬ для подтверждения");
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    const res = await fetch("/api/user", { method: "DELETE" });
    setDeleteLoading(false);

    if (!res.ok) {
      setDeleteError("Ошибка удаления аккаунта. Попробуйте позже.");
      return;
    }
    await signOut({ callbackUrl: "/" });
  }

  const cardStyle = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-light)",
    boxShadow: "var(--shadow-card)",
  };

  const inputStyle = { borderColor: "var(--border-default)" };

  const sectionHeaderStyle = {
    borderBottom: "1px solid var(--border-light)",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Настройки
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Управление аккаунтом
        </p>
      </div>

      {/* Theme toggle */}
      <div className="rounded-[18px]" style={cardStyle}>
        <div className="px-6 pt-5 pb-4" style={sectionHeaderStyle}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                style={{ background: "var(--bg-input)" }}
              >
                {theme === "dark" ? (
                  <Moon className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                ) : (
                  <Sun className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                )}
              </div>
              <div>
                <p className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Тема оформления
                </p>
                <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                  {theme === "dark" ? "Тёмная тема" : "Светлая тема"}
                </p>
              </div>
            </div>
            {/* Segmented control */}
            <div
              className="flex gap-1 p-1 rounded-[10px]"
              style={{ background: "var(--bg-input)" }}
            >
              <button
                onClick={() => theme === "dark" && toggle()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all duration-150"
                style={
                  theme === "light"
                    ? { background: "var(--accent-primary)", color: "#FFFFFF" }
                    : { background: "transparent", color: "var(--text-secondary)" }
                }
              >
                <Sun className="w-3.5 h-3.5" />
                Светлая
              </button>
              <button
                onClick={() => theme === "light" && toggle()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-semibold transition-all duration-150"
                style={
                  theme === "dark"
                    ? { background: "var(--accent-primary)", color: "#FFFFFF" }
                    : { background: "transparent", color: "var(--text-secondary)" }
                }
              >
                <Moon className="w-3.5 h-3.5" />
                Тёмная
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="rounded-[18px]" style={cardStyle}>
        <div className="px-6 pt-5 pb-4" style={sectionHeaderStyle}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center"
              style={{ background: "var(--bg-input)" }}
            >
              <Lock className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
            </div>
            <p className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
              Смена пароля
            </p>
          </div>
        </div>
        <div className="px-6 py-5">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {pwError && (
              <Alert variant="destructive">
                <AlertDescription>{pwError}</AlertDescription>
              </Alert>
            )}
            {pwSuccess && (
              <div
                className="flex items-center gap-2.5 rounded-[12px] px-4 py-3"
                style={{
                  background: "var(--color-success-light)",
                  border: "1px solid rgba(16,185,129,0.25)",
                }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--color-success)" }} />
                <p className="text-[13px] font-medium" style={{ color: "var(--color-success)" }}>
                  Пароль успешно изменён
                </p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label
                htmlFor="currentPassword"
                className="text-[13px] font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Текущий пароль
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="h-11 rounded-[10px]"
                style={inputStyle}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="newPassword"
                className="text-[13px] font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Новый пароль
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Минимум 8 символов"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="h-11 rounded-[10px]"
                style={inputStyle}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmNewPassword"
                className="text-[13px] font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Повторите новый пароль
              </Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="h-11 rounded-[10px]"
                style={inputStyle}
              />
            </div>
            <Button
              type="submit"
              className="rounded-[10px] h-10 px-6 font-semibold text-[13px] transition-all duration-200"
              style={{ background: "var(--accent-primary)", color: "#FFFFFF" }}
              disabled={pwLoading}
            >
              {pwLoading ? "Сохранение..." : "Изменить пароль"}
            </Button>
          </form>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-[18px]" style={cardStyle}>
        <div className="px-6 pt-5 pb-4" style={sectionHeaderStyle}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center"
              style={{ background: "var(--color-danger-light, #FEF2F2)" }}
            >
              <Trash2 className="w-4 h-4" style={{ color: "var(--color-danger, #EF4444)" }} />
            </div>
            <p className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
              Удаление аккаунта
            </p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
            После удаления аккаунта все ваши данные — долги, планы, история — будут
            безвозвратно уничтожены. Это действие нельзя отменить.
          </p>
          <Button
            variant="outline"
            className="rounded-[10px] h-10 px-5 text-[13px] transition-all duration-200"
            style={{ border: "1px solid #FEE2E2", color: "#DC2626" }}
            onClick={() => setDeleteOpen(true)}
          >
            Удалить аккаунт
          </Button>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent
              className="rounded-[18px] sm:max-w-md"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
              }}
            >
              <DialogHeader>
                <DialogTitle style={{ color: "var(--text-primary)" }}>Вы уверены?</DialogTitle>
                <DialogDescription style={{ color: "var(--text-secondary)" }}>
                  Это действие нельзя отменить. Все ваши данные будут удалены навсегда.
                  Введите <strong>УДАЛИТЬ</strong> для подтверждения.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                {deleteError && (
                  <Alert variant="destructive">
                    <AlertDescription>{deleteError}</AlertDescription>
                  </Alert>
                )}
                <Input
                  placeholder="УДАЛИТЬ"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className="h-11 rounded-[10px]"
                  style={inputStyle}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                  className="rounded-[10px]"
                  style={{
                    border: "1px solid var(--border-default)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirm !== "УДАЛИТЬ"}
                  className="rounded-[10px] bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteLoading ? "Удаление..." : "Удалить навсегда"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
