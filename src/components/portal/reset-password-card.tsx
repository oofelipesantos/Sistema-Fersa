"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorSummary, FieldMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import {
  resetPasswordSchema,
  type ResetPasswordValues
} from "@/features/auth/auth-schema";
import { AuthService } from "@/services/auth-service";
import type { Locale } from "@/types/domain";

export function ResetPasswordCard() {
  const t = useTranslations("auth");
  const locale = useLocale() as Locale;
  const [sent, setSent] = useState(false);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" }
  });
  async function submit(values: ResetPasswordValues) {
    form.clearErrors("root");
    try {
      await new AuthService().resetPassword(values.email, locale);
      setSent(true);
    } catch {
      form.setError("root", { message: t("resetError") });
    }
  }
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold">{t("resetTitle")}</h1>
        <p className="mt-2 text-base leading-6 text-slate-600">
          {t("resetDescription")}
        </p>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
          <ErrorSummary>{form.formState.errors.root?.message}</ErrorSummary>
          <label
            className="block text-base font-semibold"
            htmlFor="reset-email"
          >
            {t("email")}
            <Input
              aria-invalid={Boolean(form.formState.errors.email)}
              autoComplete="email"
              className="mt-1.5"
              id="reset-email"
              type="email"
              {...form.register("email")}
            />
            <FieldMessage id="reset-email-error">
              {form.formState.errors.email ? t("invalidEmail") : undefined}
            </FieldMessage>
          </label>
          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            size="lg"
            type="submit"
          >
            {form.formState.isSubmitting ? t("sendingReset") : t("sendReset")}
          </Button>
        </form>
        {sent && (
          <p
            className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900"
            role="status"
          >
            {t("resetSent")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
