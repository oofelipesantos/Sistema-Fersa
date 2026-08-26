"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Link } from "@/i18n/navigation";
import type { KnownIssue, Locale, Product } from "@/types/domain";

export function KnowledgeBase({
  products,
  issues,
  locale
}: {
  products: Product[];
  issues: KnownIssue[];
  locale: Locale;
}) {
  const t = useTranslations("knowledge");
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [issueId, setIssueId] = useState(issues[0]?.id ?? "");
  const [checked, setChecked] = useState<string[]>([]);
  const [resolved, setResolved] = useState(false);
  const productIssues = issues.filter((issue) => issue.productId === productId);
  const issue =
    productIssues.find((item) => item.id === issueId) ?? productIssues[0];
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-sm text-slate-500">{t("subtitle")}</p>
      </div>
      <Card>
        <CardContent className="space-y-4 p-5">
          <label className="block text-sm font-semibold">
            {t("selectProduct")}
            <Select
              className="mt-1"
              onChange={(event) => {
                setProductId(event.target.value);
                setIssueId("");
                setChecked([]);
              }}
              value={productId}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.partNumber} · {product.translations[locale]?.name}
                </option>
              ))}
            </Select>
          </label>
          {issue && (
            <label className="block text-sm font-semibold">
              {issue.translations[locale]?.title}
              <Select
                className="mt-1"
                onChange={(event) => {
                  setIssueId(event.target.value);
                  setChecked([]);
                }}
                value={issueId || issue.id}
              >
                {productIssues.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.translations[locale]?.title}
                  </option>
                ))}
              </Select>
            </label>
          )}
        </CardContent>
      </Card>
      {issue && (
        <Card>
          <CardContent className="p-5">
            <h2 className="font-bold">{t("steps")}</h2>
            <div className="mt-4 space-y-4">
              {issue.steps.map((step) => (
                <label className="flex gap-3" key={step.id}>
                  <input
                    checked={checked.includes(step.id)}
                    className="mt-1 h-4 w-4 accent-[#123a5b]"
                    onChange={() =>
                      setChecked((items) =>
                        items.includes(step.id)
                          ? items.filter((item) => item !== step.id)
                          : [...items, step.id]
                      )
                    }
                    type="checkbox"
                  />
                  <span>
                    <span className="text-sm font-bold">
                      {step.order}. {step.title[locale]}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">
                      {step.description[locale]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {issue && checked.length === issue.steps.length && (
        <Card className="border-navy-600">
          <CardContent className="p-5">
            <p className="font-bold">{t("question")}</p>
            {resolved ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 className="h-5 w-5" aria-hidden />
                {t("resolvedMessage")}
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={() => setResolved(true)}>
                  {t("resolved")}
                </Button>
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href="/tickets/new"
                >
                  {t("notResolved")}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
