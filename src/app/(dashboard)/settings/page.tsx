"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Lock, Trash2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
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

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">Настройки</h1>
        <p className="text-sm text-[#64748b] mt-0.5">Управление аккаунтом</p>
      </div>

      {/* Change password */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="px-6 pt-5 pb-0">
          <CardTitle className="text-base font-bold text-[#0f172a] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#1e40af]" />
            </div>
            Смена пароля
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {pwError && (
              <Alert variant="destructive">
                <AlertDescription>{pwError}</AlertDescription>
              </Alert>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <p className="text-sm text-[#059669] font-medium">Пароль успешно изменён</p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-sm font-medium text-[#0f172a]">
                Текущий пароль
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-[#e2e8f0] focus:border-[#3b82f6]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-sm font-medium text-[#0f172a]">
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
                className="h-11 rounded-xl border-[#e2e8f0] focus:border-[#3b82f6]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmNewPassword" className="text-sm font-medium text-[#0f172a]">
                Повторите новый пароль
              </Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-[#e2e8f0] focus:border-[#3b82f6]"
              />
            </div>
            <Button
              type="submit"
              className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white rounded-xl h-11 px-6 font-semibold transition-all duration-200"
              disabled={pwLoading}
            >
              {pwLoading ? "Сохранение..." : "Изменить пароль"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white">
        <CardHeader className="px-6 pt-5 pb-0">
          <CardTitle className="text-base font-bold text-[#0f172a] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-500" />
            </div>
            Удаление аккаунта
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-5 space-y-4">
          <p className="text-sm text-[#64748b]">
            После удаления аккаунта все ваши данные — долги, планы, история — будут
            безвозвратно уничтожены. Это действие нельзя отменить.
          </p>
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl h-11 transition-all duration-200"
            onClick={() => setDeleteOpen(true)}
          >
            Удалить аккаунт
          </Button>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Вы уверены?</DialogTitle>
                <DialogDescription>
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
                  className="h-11 rounded-xl border-[#e2e8f0]"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                  className="border-[#e2e8f0] rounded-xl"
                >
                  Отмена
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirm !== "УДАЛИТЬ"}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  {deleteLoading ? "Удаление..." : "Удалить навсегда"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
