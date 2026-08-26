"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { isMockMode } from "@/lib/utils";
import { AuthService } from "@/services/auth-service";
import type { UserRole } from "@/types/domain";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
type Values = z.infer<typeof schema>;
const roles: UserRole[] = [
  "DISTRIBUTOR",
  "MECHANIC",
  "SUPPORT",
  "TECHNICIAN",
  "ADMIN"
];

export function AuthCard() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "demo@fersa.test", password: "demo" }
  });
  async function submit(values: Values) {
    setBusy(true);
    try {
      await new AuthService().signIn(values.email, values.password);
      router.push("/");
    } finally {
      setBusy(false);
    }
  }
  function mockLogin(role: UserRole) {
    localStorage.setItem("fersa-demo-role", role);
    router.push(role === "SUPPORT" || role === "ADMIN" ? "/service" : "/");
  }
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("subtitle")}</p>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
          <label className="block text-sm font-semibold">
            {t("email")}
            <Input className="mt-1" type="email" {...form.register("email")} />
          </label>
          <label className="block text-sm font-semibold">
            {t("password")}
            <Input
              className="mt-1"
              type="password"
              {...form.register("password")}
            />
          </label>
          <Button className="w-full" disabled={busy} type="submit">
            {t("signIn")}
          </Button>
        </form>
        <Link
          className="mt-4 inline-block text-sm font-semibold text-navy-700"
          href="/auth/forgot-password"
        >
          {t("forgot")}
        </Link>
        {isMockMode() && (
          <div className="mt-6 border-t pt-5">
            <p className="text-sm font-bold">{t("mockAccess")}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <Button
                  key={role}
                  onClick={() => mockLogin(role)}
                  variant="outline"
                >
                  {t(role)}
                </Button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">{t("mockHint")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
