"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorSummary, FieldMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import {
  updatePasswordSchema,
  type UpdatePasswordValues
} from "@/features/auth/auth-schema";
import { Link } from "@/i18n/navigation";
import { AuthService } from "@/services/auth-service";

export function UpdatePasswordCard() {
  const t = useTranslations("auth");
  const [updated, setUpdated] = useState(false);
  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });
  async function submit(values: UpdatePasswordValues) {
    try {
      await new AuthService().updatePassword(values.password);
      setUpdated(true);
    } catch {
      form.setError("root", { message: t("updatePasswordError") });
    }
  }
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold">{t("updatePasswordTitle")}</h1>
        <p className="mt-2 text-base leading-6 text-slate-600">
          {t("passwordHint")}
        </p>
        {updated ? (
          <div className="mt-6">
            <p
              className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-base font-semibold text-emerald-900"
              role="status"
            >
              {t("passwordUpdated")}
            </p>
            <Link
              className="mt-5 inline-flex min-h-12 items-center font-bold text-navy-700 underline"
              href="/auth/login"
            >
              {t("backToLogin")}
            </Link>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
            <ErrorSummary>{form.formState.errors.root?.message}</ErrorSummary>
            <label
              className="block text-base font-semibold"
              htmlFor="new-password"
            >
              {t("newPassword")}
              <Input
                autoComplete="new-password"
                className="mt-1.5"
                id="new-password"
                type="password"
                {...form.register("password")}
              />
              <FieldMessage id="new-password-error">
                {form.formState.errors.password ? t("weakPassword") : undefined}
              </FieldMessage>
            </label>
            <label
              className="block text-base font-semibold"
              htmlFor="confirm-new-password"
            >
              {t("confirmPassword")}
              <Input
                autoComplete="new-password"
                className="mt-1.5"
                id="confirm-new-password"
                type="password"
                {...form.register("confirmPassword")}
              />
              <FieldMessage id="confirm-new-password-error">
                {form.formState.errors.confirmPassword
                  ? t("passwordsDoNotMatch")
                  : undefined}
              </FieldMessage>
            </label>
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting}
              size="lg"
              type="submit"
            >
              {t("saveNewPassword")}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
