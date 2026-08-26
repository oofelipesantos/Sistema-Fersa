"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/auth-service";

export function ResetPasswordCard() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await new AuthService().resetPassword(email);
    setSent(true);
  }
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold">{t("resetTitle")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("resetDescription")}</p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">
            {t("email")}
            <Input
              className="mt-1"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <Button className="w-full" type="submit">
            {t("sendReset")}
          </Button>
        </form>
        {sent && (
          <p className="mt-4 text-sm text-emerald-700">
            {t("resetDescription")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
