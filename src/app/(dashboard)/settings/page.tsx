"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const router = useRouter();

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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#0f172a]">Настройки</h1>

      {/* Change password */}
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-lg text-[#0f172a]">Смена пароля</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {pwError && (
              <Alert variant="destructive">
                <AlertDescription>{pwError}</AlertDescription>
              </Alert>
            )}
            {pwSuccess && (
              <Alert className="border-[#d1fae5] bg-[#d1fae5]">
                <AlertDescription className="text-[#059669]">Пароль успешно изменён</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="border-[#e2e8f0]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Минимум 8 символов"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="border-[#e2e8f0]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Повторите новый пароль</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="border-[#e2e8f0]"
              />
            </div>
            <Button
              type="submit"
              className="bg-[#1e40af] hover:bg-[#1d3a9e] text-white"
              disabled={pwLoading}
            >
              {pwLoading ? "Сохранение..." : "Изменить пароль"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="bg-[#e2e8f0]" />

      {/* Danger zone */}
      <Card className="border-[#fca5a5]">
        <CardHeader>
          <CardTitle className="text-lg text-[#0f172a]">Удаление аккаунта</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#64748b]">
            После удаления аккаунта все ваши данные — долги, планы, история — будут безвозвратно уничтожены.
            Это действие нельзя отменить.
          </p>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-[#fca5a5] text-red-600 hover:bg-red-50">
                Удалить аккаунт
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                  className="border-[#e2e8f0]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)} className="border-[#e2e8f0]">
                  Отмена
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirm !== "УДАЛИТЬ"}
                  className="bg-red-600 hover:bg-red-700 text-white"
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
