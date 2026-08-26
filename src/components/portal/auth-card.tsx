"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorSummary, FieldMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import {
  getSafeReturnPath,
  isInternalRole
} from "@/features/auth/access-control";
import { loginSchema, type LoginValues } from "@/features/auth/auth-schema";
import { Link, useRouter } from "@/i18n/navigation";
import { isMockMode } from "@/lib/utils";
import { AuthService } from "@/services/auth-service";

const demoAccounts = [
  { key: "demoCustomer", email: "demo@fersa.test", password: "Demo123!" },
  { key: "demoAdmin", email: "admin@fersa.test", password: "Admin123!" }
] as const;

export function AuthCard({ returnTo }: { returnTo?: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });
  async function submit(values: LoginValues) {
    form.clearErrors("root");
    try {
      const session = await new AuthService().signIn(
        values.email,
        values.password
      );
      const destination = isInternalRole(session.user.role)
        ? "/service"
        : getSafeReturnPath(returnTo);
      router.replace(destination);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      form.setError("root", {
        message:
          code === "ACCOUNT_BLOCKED"
            ? t("accountBlocked")
            : t("invalidCredentials")
      });
    }
  }
  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-base leading-6 text-slate-600">
          {t("subtitle")}
        </p>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(submit)}>
          <ErrorSummary>{form.formState.errors.root?.message}</ErrorSummary>
          <label
            className="block text-base font-semibold"
            htmlFor="login-email"
          >
            {t("email")}
            <Input
              aria-describedby="login-email-error"
              aria-invalid={Boolean(form.formState.errors.email)}
              autoComplete="email"
              className="mt-1.5"
              id="login-email"
              type="email"
              {...form.register("email")}
            />
            <FieldMessage id="login-email-error">
              {form.formState.errors.email ? t("invalidEmail") : undefined}
            </FieldMessage>
          </label>
          <label
            className="block text-base font-semibold"
            htmlFor="login-password"
          >
            {t("password")}
            <Input
              aria-describedby="login-password-error"
              aria-invalid={Boolean(form.formState.errors.password)}
              autoComplete="current-password"
              className="mt-1.5"
              id="login-password"
              type="password"
              {...form.register("password")}
            />
            <FieldMessage id="login-password-error">
              {form.formState.errors.password ? t("requiredField") : undefined}
            </FieldMessage>
          </label>
          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            size="lg"
            type="submit"
          >
            {form.formState.isSubmitting ? t("signingIn") : t("signIn")}
          </Button>
        </form>
        <div className="mt-5 flex flex-col gap-3 text-base font-semibold sm:flex-row sm:justify-between">
          <Link
            className="text-navy-700 underline-offset-4 hover:underline"
            href="/auth/forgot-password"
          >
            {t("forgot")}
          </Link>
          <Link
            className="text-navy-700 underline-offset-4 hover:underline"
            href="/auth/register"
          >
            {t("createAccount")}
          </Link>
        </div>
        {isMockMode() && (
          <div className="mt-6 border-t pt-5">
            <p className="text-base font-bold">{t("demoAccounts")}</p>
            <p className="mt-1 text-sm text-slate-600">{t("demoHint")}</p>
            <div className="mt-3 grid gap-2">
              {demoAccounts.map((account) => (
                <Button
                  className="h-auto min-h-12 justify-start px-4 py-2 text-left"
                  key={account.email}
                  onClick={() => {
                    form.setValue("email", account.email, {
                      shouldValidate: true
                    });
                    form.setValue("password", account.password, {
                      shouldValidate: true
                    });
                  }}
                  variant="outline"
                >
                  <span>
                    <span className="block">{t(account.key)}</span>
                    <span className="block text-xs font-normal text-slate-500">
                      {account.email} · {account.password}
                    </span>
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
