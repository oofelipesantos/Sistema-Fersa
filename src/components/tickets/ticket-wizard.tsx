"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
  Paperclip
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
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
  const [success, setSuccess] = useState<number>();
  const [loading, setLoading] = useState(false);
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      productId: products[0]?.id,
      categoryId: categories[0]?.id,
      description: "",
      country: "Brasil"
    }
  });
  const product = products.find((item) => item.id === form.watch("productId"));
  const category = categories.find(
    (item) => item.id === form.watch("categoryId")
  );
  async function next() {
    const fields: (keyof TicketFormValues)[] =
      step === 0
        ? ["productId"]
        : step === 1
          ? ["categoryId", "description"]
          : [];
    if (fields.length === 0 || (await form.trigger(fields)))
      setStep((value) => Math.min(value + 1, stepKeys.length - 1));
  }
  function captureLocation() {
    navigator.geolocation?.getCurrentPosition((position) => {
      form.setValue("latitude", position.coords.latitude);
      form.setValue("longitude", position.coords.longitude);
    });
  }
  async function submit(values: TicketFormValues) {
    setLoading(true);
    try {
      const { ticket } = await new TicketService().create({
        ...values,
        locale
      });
      setSuccess(ticket.number);
    } finally {
      setLoading(false);
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
            {t("success", { number: success })}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{t("routingReason")}</p>
          <Link
            className="mt-6 inline-flex rounded-lg bg-navy-700 px-4 py-2 text-sm font-bold text-white"
            href={`/tickets/ticket-${success}`}
          >
            {ticketT("title")}
          </Link>
        </CardContent>
      </Card>
    );
  return (
    <form
      className="mx-auto max-w-2xl space-y-5"
      onSubmit={form.handleSubmit(submit)}
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
                <p className="text-sm text-red-600">{t("validation")}</p>
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
                  type="number"
                  {...form.register("hours", { valueAsNumber: true })}
                />
              </label>
              <label className="text-sm font-semibold">
                {t("quantity")}
                <Input
                  className="mt-1"
                  type="number"
                  {...form.register("quantity", { valueAsNumber: true })}
                />
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
                className="mt-3 text-sm"
                multiple
                type="file"
              />
              <p className="mt-2 text-xs text-slate-500">{t("evidenceHint")}</p>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <Button onClick={captureLocation} variant="outline">
                <LocateFixed className="h-4 w-4" aria-hidden />
                {t("useLocation")}
              </Button>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">
                  {t("country")}
                  <Input className="mt-1" {...form.register("country")} />
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
                value={form.watch("description")}
              />
              <Review label={t("routing")} value={t("routingReason")} />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-between gap-3">
        <Button
          disabled={step === 0 || loading}
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
          <Button disabled={loading} type="submit">
            {t("submit")}
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
