"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorSummary, FieldMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  registrationSchema,
  type RegistrationValues
} from "@/features/auth/auth-schema";
import { Link, useRouter } from "@/i18n/navigation";
import { AuthService } from "@/services/auth-service";
import type { Locale } from "@/types/domain";

const draftKey = "fersa-registration-draft-v1";
const stepFields: (keyof RegistrationValues)[][] = [
  ["fullName", "email", "phone"],
  ["organizationName", "organizationType", "taxDocument", "country"],
  ["password", "confirmPassword", "acceptedTerms"]
];

const initialValues: RegistrationValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  organizationName: "",
  organizationType: "WORKSHOP",
  taxDocument: "",
  country: "Brasil",
  acceptedTerms: false
};

export function RegistrationCard() {
  const t = useTranslations("register");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<"created" | "confirmation">();
  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: initialValues
  });
  const draftValues = useWatch({ control: form.control });

  useEffect(() => {
    const stored = localStorage.getItem(draftKey);
    if (stored) {
      try {
        const draft = JSON.parse(stored) as Partial<RegistrationValues> & {
          step?: number;
        };
        form.reset({
          ...initialValues,
          ...draft,
          password: "",
          confirmPassword: ""
        });
        const restoredStep = Math.min(Math.max(draft.step ?? 0, 0), 2);
        queueMicrotask(() => setStep(restoredStep));
      } catch {
        localStorage.removeItem(draftKey);
      }
    }
  }, [form]);

  useEffect(() => {
    const {
      password: _password,
      confirmPassword: _confirmation,
      ...safe
    } = draftValues;
    void _password;
    void _confirmation;
    localStorage.setItem(draftKey, JSON.stringify({ ...safe, step }));
  }, [draftValues, step]);

  async function next() {
    if (await form.trigger(stepFields[step], { shouldFocus: true }))
      setStep((value) => Math.min(value + 1, 2));
  }

  async function submit(values: RegistrationValues) {
    form.clearErrors("root");
    try {
      const result = await new AuthService().signUp(values, locale);
      localStorage.removeItem(draftKey);
      setCompleted(result.needsEmailConfirmation ? "confirmation" : "created");
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      form.setError("root", {
        message:
          code === "EMAIL_ALREADY_REGISTERED"
            ? t("emailAlreadyRegistered")
            : t("unexpectedError")
      });
    }
  }

  if (completed)
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="p-7 text-center sm:p-9">
          <CheckCircle2
            className="mx-auto h-14 w-14 text-emerald-700"
            aria-hidden
          />
          <h1 className="mt-4 text-2xl font-bold">{t("successTitle")}</h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-slate-700">
            {completed === "confirmation"
              ? t("confirmationRequired")
              : t("pendingExplanation")}
          </p>
          {completed === "created" ? (
            <Button
              className="mt-6"
              onClick={() => router.replace("/tickets/new")}
              size="lg"
            >
              {t("openFirstTicket")}
            </Button>
          ) : (
            <Link
              className="mt-6 inline-flex min-h-12 items-center font-bold text-navy-700 underline"
              href="/auth/login"
            >
              {t("backToLogin")}
            </Link>
          )}
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-6 sm:p-8">
        <p className="text-sm font-bold text-navy-700">
          {t("step", { current: step + 1, total: 3 })}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{t(`step${step + 1}Title`)}</h1>
        <p className="mt-2 text-base leading-6 text-slate-600">
          {t(`step${step + 1}Description`)}
        </p>
        <ol
          className="mt-5 grid grid-cols-3 gap-2"
          aria-label={t("progressLabel")}
        >
          {[0, 1, 2].map((index) => (
            <li
              aria-current={index === step ? "step" : undefined}
              className={`h-2 rounded-full ${index <= step ? "bg-navy-700" : "bg-steel-200"}`}
              key={index}
            >
              <span className="sr-only">
                {t("stepName", { number: index + 1 })}
              </span>
            </li>
          ))}
        </ol>

        <form className="mt-6 space-y-5" onSubmit={form.handleSubmit(submit)}>
          <ErrorSummary>{form.formState.errors.root?.message}</ErrorSummary>
          {step === 0 && (
            <>
              <Field
                error={
                  form.formState.errors.fullName
                    ? t("invalidFullName")
                    : undefined
                }
                id="register-full-name"
                label={t("fullName")}
              >
                <Input
                  autoComplete="name"
                  id="register-full-name"
                  {...form.register("fullName")}
                />
              </Field>
              <Field
                error={
                  form.formState.errors.email ? t("invalidEmail") : undefined
                }
                id="register-email"
                label={t("email")}
              >
                <Input
                  autoComplete="email"
                  id="register-email"
                  type="email"
                  {...form.register("email")}
                />
              </Field>
              <Field
                error={
                  form.formState.errors.phone ? t("invalidPhone") : undefined
                }
                hint={t("phoneHint")}
                id="register-phone"
                label={t("phone")}
              >
                <Input
                  autoComplete="tel"
                  id="register-phone"
                  inputMode="tel"
                  {...form.register("phone")}
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field
                error={
                  form.formState.errors.organizationName
                    ? t("invalidOrganization")
                    : undefined
                }
                id="register-organization"
                label={t("organizationName")}
              >
                <Input
                  autoComplete="organization"
                  id="register-organization"
                  {...form.register("organizationName")}
                />
              </Field>
              <Field id="register-type" label={t("organizationType")}>
                <Select
                  id="register-type"
                  {...form.register("organizationType")}
                >
                  <option value="DISTRIBUTOR">{t("typeDistributor")}</option>
                  <option value="WORKSHOP">{t("typeWorkshop")}</option>
                  <option value="CUSTOMER">{t("typeCustomer")}</option>
                </Select>
              </Field>
              <Field
                error={
                  form.formState.errors.taxDocument
                    ? t("invalidTaxDocument")
                    : undefined
                }
                hint={t("taxDocumentHint")}
                id="register-tax-document"
                label={t("taxDocument")}
              >
                <Input
                  id="register-tax-document"
                  {...form.register("taxDocument")}
                />
              </Field>
              <Field
                error={
                  form.formState.errors.country
                    ? t("invalidCountry")
                    : undefined
                }
                id="register-country"
                label={t("country")}
              >
                <Input
                  autoComplete="country-name"
                  id="register-country"
                  {...form.register("country")}
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field
                error={
                  form.formState.errors.password ? t("weakPassword") : undefined
                }
                hint={t("passwordHint")}
                id="register-password"
                label={t("password")}
              >
                <Input
                  autoComplete="new-password"
                  id="register-password"
                  type="password"
                  {...form.register("password")}
                />
              </Field>
              <Field
                error={
                  form.formState.errors.confirmPassword
                    ? t("passwordsDoNotMatch")
                    : undefined
                }
                id="register-confirm-password"
                label={t("confirmPassword")}
              >
                <Input
                  autoComplete="new-password"
                  id="register-confirm-password"
                  type="password"
                  {...form.register("confirmPassword")}
                />
              </Field>
              <div>
                <label
                  className="flex min-h-12 items-start gap-3 text-base font-semibold"
                  htmlFor="register-terms"
                >
                  <input
                    className="border-steel-300 mt-1 h-5 w-5 shrink-0 rounded"
                    id="register-terms"
                    type="checkbox"
                    {...form.register("acceptedTerms")}
                  />
                  <span>{t("acceptTerms")}</span>
                </label>
                <FieldMessage id="register-terms-error">
                  {form.formState.errors.acceptedTerms
                    ? t("termsRequired")
                    : undefined}
                </FieldMessage>
              </div>
              <p className="rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                {t("verificationNotice")}
              </p>
            </>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            {step === 0 ? (
              <Link
                className="inline-flex min-h-12 items-center justify-center px-4 font-bold text-navy-700 underline"
                href="/auth/login"
              >
                {t("alreadyRegistered")}
              </Link>
            ) : (
              <Button
                onClick={() => setStep((value) => value - 1)}
                size="lg"
                variant="outline"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
                {common("back")}
              </Button>
            )}
            {step < 2 ? (
              <Button onClick={() => void next()} size="lg">
                {common("continue")}
                <ChevronRight className="h-5 w-5" aria-hidden />
              </Button>
            ) : (
              <Button
                disabled={form.formState.isSubmitting}
                size="lg"
                type="submit"
              >
                {form.formState.isSubmitting
                  ? t("creating")
                  : t("createAccount")}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  children,
  error,
  hint,
  id,
  label
}: {
  children: React.ReactElement;
  error?: string;
  hint?: string;
  id: string;
  label: string;
}) {
  return (
    <label className="block text-base font-semibold" htmlFor={id}>
      {label}
      <span className="mt-1.5 block">{children}</span>
      {hint && (
        <span className="mt-1.5 block text-sm font-normal text-slate-600">
          {hint}
        </span>
      )}
      <FieldMessage id={`${id}-error`}>{error}</FieldMessage>
    </label>
  );
}
