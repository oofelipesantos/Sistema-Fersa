"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
  Paperclip
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorSummary, FieldMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/features/auth/auth-context";
import {
  ticketSchema,
  type TicketFormValues
} from "@/features/tickets/ticket-schema";
import { TicketService } from "@/services/ticket-service";
import type { IssueCategory, Locale, Product } from "@/types/domain";

const stepKeys = [
  "product",
  "problem",
  "equipment",
  "evidence",
  "location",
  "review"
] as const;

export function TicketWizard({
  products,
  categories,
  locale
}: {
  products: Product[];
  categories: IssueCategory[];
  locale: Locale;
}) {
  const t = useTranslations("wizard");
  const ticketT = useTranslations("ticket");
  const common = useTranslations("common");
  const [step, setStep] = useState(0);
  const { session } = useAuth();
  const [success, setSuccess] = useState<{ id: string; number: number }>();
  const [locationError, setLocationError] = useState(false);
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      productId: products[0]?.id,
      categoryId: categories[0]?.id,
      description: "",
      equipment: "",
      serialNumber: "",
      lot: "",
      hours: "",
      quantity: "",
      country: "Brasil",
      state: "",
      city: "",
      confirmed: false
    }
  });
  const draftValues = useWatch({ control: form.control });
  const draftKey = `fersa-ticket-draft-v1-${session?.user.id ?? "anonymous"}`;

  useEffect(() => {
    const stored = localStorage.getItem(draftKey);
    if (stored) {
      try {
        const draft = JSON.parse(stored) as Partial<TicketFormValues> & {
          step?: number;
        };
        form.reset({ ...form.getValues(), ...draft, attachments: undefined });
        const restoredStep = Math.min(
          Math.max(draft.step ?? 0, 0),
          stepKeys.length - 1
        );
        queueMicrotask(() => setStep(restoredStep));
      } catch {
        localStorage.removeItem(draftKey);
      }
    }
  }, [draftKey, form]);

  useEffect(() => {
    const { attachments: _attachments, ...safeValues } = draftValues;
    void _attachments;
    localStorage.setItem(draftKey, JSON.stringify({ ...safeValues, step }));
  }, [draftKey, draftValues, step]);
  const product = products.find((item) => item.id === draftValues.productId);
  const category = categories.find(
    (item) => item.id === draftValues.categoryId
  );
  async function next() {
    const fields: (keyof TicketFormValues)[] =
      step === 0
        ? ["productId"]
        : step === 1
          ? ["categoryId", "description"]
          : step === 2
            ? ["equipment", "serialNumber", "lot", "hours", "quantity"]
            : step === 3
              ? ["attachments"]
              : step === 4
                ? ["country", "state", "city"]
                : [];
    if (fields.length === 0 || (await form.trigger(fields)))
      setStep((value) => Math.min(value + 1, stepKeys.length - 1));
  }
  function captureLocation() {
    setLocationError(false);
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue("latitude", position.coords.latitude);
        form.setValue("longitude", position.coords.longitude);
      },
      () => setLocationError(true)
    );
  }
  async function submit(values: TicketFormValues) {
    form.clearErrors("root");
    try {
      const { attachments, confirmed: _confirmed, ...fields } = values;
      void _confirmed;
      const { ticket } = await new TicketService().create(
        {
          ...fields,
          hours: values.hours ? Number(values.hours) : undefined,
          quantity: values.quantity ? Number(values.quantity) : undefined,
          locale
        },
        attachments ? Array.from(attachments) : []
      );
      localStorage.removeItem(draftKey);
      setSuccess({ id: ticket.id, number: ticket.number });
    } catch {
      form.setError("root", { message: t("submitError") });
    }
  }
  if (success)
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle2
            className="mx-auto h-12 w-12 text-emerald-600"
            aria-hidden
          />
          <h1 className="mt-4 text-xl font-bold">
            {t("success", { number: success.number })}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t("routingReason")}</p>
          <Link
            className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-navy-700 px-4 py-2 text-base font-bold text-white"
            href={`/tickets/${success.id}`}
          >
            {ticketT("title")}
          </Link>
        </CardContent>
      </Card>
    );
  return (
    <form
      className="mx-auto max-w-2xl space-y-5"
      noValidate
      onSubmit={form.handleSubmit(submit, () =>
        form.setError("root", { message: t("validation") })
      )}
    >
      <div>
        <p className="text-sm font-semibold text-navy-700">
          {t("step", { current: step + 1, total: stepKeys.length })}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{t(stepKeys[step])}</h1>
        <div className="mt-4 flex gap-1">
          {stepKeys.map((key, index) => (
            <div
              className={`h-1 flex-1 rounded ${index <= step ? "bg-navy-700" : "bg-steel-200"}`}
              key={key}
            />
          ))}
        </div>
      </div>
      <Card>
        <CardContent className="space-y-4 p-5">
          <ErrorSummary>{form.formState.errors.root?.message}</ErrorSummary>
          {step === 0 && (
            <>
              <label className="block text-sm font-semibold">
                {t("selectProduct")}
                <Select className="mt-1" {...form.register("productId")}>
                  {products.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.partNumber} · {item.translations[locale]?.name}
                    </option>
                  ))}
                </Select>
              </label>
              {product && (
                <div className="rounded-lg bg-steel-50 p-3 text-sm text-slate-600">
                  {product.translations[locale]?.description}
                </div>
              )}
            </>
          )}
          {step === 1 && (
            <>
              <label className="block text-sm font-semibold">
                {t("selectCategory")}
                <Select className="mt-1" {...form.register("categoryId")}>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.translations[locale]}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="block text-sm font-semibold">
                {t("description")}
                <Textarea
                  className="mt-1"
                  placeholder={t("descriptionPlaceholder")}
                  {...form.register("description")}
                />
              </label>
              {form.formState.errors.description && (
                <FieldMessage id="description-error">
                  {t("descriptionError")}
                </FieldMessage>
              )}
            </>
          )}
          {step === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                {ticketT("equipment")}
                <Input className="mt-1" {...form.register("equipment")} />
              </label>
              <label className="text-sm font-semibold">
                {ticketT("serialNumber")}
                <Input className="mt-1" {...form.register("serialNumber")} />
              </label>
              <label className="text-sm font-semibold">
                {t("lot")}
                <Input className="mt-1" {...form.register("lot")} />
              </label>
              <label className="text-sm font-semibold">
                {t("hours")}
                <Input
                  className="mt-1"
                  inputMode="numeric"
                  {...form.register("hours")}
                />
                <FieldMessage id="hours-error">
                  {form.formState.errors.hours ? t("integerOnly") : undefined}
                </FieldMessage>
              </label>
              <label className="text-sm font-semibold">
                {t("quantity")}
                <Input
                  className="mt-1"
                  inputMode="numeric"
                  {...form.register("quantity")}
                />
                <FieldMessage id="quantity-error">
                  {form.formState.errors.quantity
                    ? t("integerOnly")
                    : undefined}
                </FieldMessage>
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Paperclip
                className="mx-auto h-6 w-6 text-navy-700"
                aria-hidden
              />
              <p className="mt-2 text-sm font-semibold">{t("addEvidence")}</p>
              <input
                aria-label={t("addEvidence")}
                className="file:text-navy-800 mt-3 min-h-12 max-w-full text-base file:mr-3 file:min-h-12 file:rounded-lg file:border-0 file:bg-navy-50 file:px-4 file:font-bold"
                multiple
                type="file"
                {...form.register("attachments")}
              />
              <p className="mt-2 text-sm text-slate-600">{t("evidenceHint")}</p>
              <FieldMessage id="attachments-error">
                {form.formState.errors.attachments
                  ? t("attachmentsError")
                  : undefined}
              </FieldMessage>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <Button onClick={captureLocation} variant="outline">
                <LocateFixed className="h-4 w-4" aria-hidden />
                {t("useLocation")}
              </Button>
              {locationError && (
                <p
                  className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-900"
                  role="alert"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden
                  />
                  {t("locationError")}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  {t("country")}
                  <Input className="mt-1" {...form.register("country")} />
                  <FieldMessage id="country-error">
                    {form.formState.errors.country
                      ? t("countryError")
                      : undefined}
                  </FieldMessage>
                </label>
                <label className="text-sm font-semibold">
                  {t("state")}
                  <Input className="mt-1" {...form.register("state")} />
                </label>
                <label className="text-sm font-semibold">
                  {t("city")}
                  <Input className="mt-1" {...form.register("city")} />
                </label>
              </div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-3 text-sm">
              <Review
                label={t("product")}
                value={
                  product
                    ? `${product.partNumber} · ${product.translations[locale]?.name}`
                    : ""
                }
              />
              <Review
                label={t("problem")}
                value={category?.translations[locale] ?? ""}
              />
              <Review
                label={t("description")}
                value={draftValues.description ?? ""}
              />
              <Review label={t("routing")} value={t("routingReason")} />
              <label
                className="flex min-h-12 items-start gap-3 rounded-lg border bg-steel-50 p-4 text-base font-semibold"
                htmlFor="confirm-ticket"
              >
                <input
                  className="mt-1 h-5 w-5 shrink-0"
                  id="confirm-ticket"
                  type="checkbox"
                  {...form.register("confirmed")}
                />
                <span>{t("confirmBeforeSubmit")}</span>
              </label>
              <FieldMessage id="confirmed-error">
                {form.formState.errors.confirmed
                  ? t("confirmationRequired")
                  : undefined}
              </FieldMessage>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between gap-3">
        <Button
          disabled={step === 0 || form.formState.isSubmitting}
          onClick={() => setStep((value) => value - 1)}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {common("back")}
        </Button>
        {step < stepKeys.length - 1 ? (
          <Button onClick={next}>
            {common("continue")}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        ) : (
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? t("submitting") : t("submit")}
          </Button>
        )}
      </div>
    </form>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-bold text-slate-700">{label}</p>
      <p className="mt-1 text-slate-500">{value}</p>
    </div>
  );
}
