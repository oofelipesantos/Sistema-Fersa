"use client";

import { ArrowRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { BearingMark } from "@/components/layout/bearing-mark";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale, Product } from "@/types/domain";

type ProductLine = { title: string; description: string };

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

export function ProductCatalog({
  products,
  locale
}: {
  products: Product[];
  locale: Locale;
}) {
  const t = useTranslations("catalog");
  const common = useTranslations("common");
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<string>();
  const families = useMemo(
    () => [...new Set(products.map((product) => product.family))],
    [products]
  );
  const lines = t.raw("lines") as ProductLine[];
  const visible = products.filter((product) => {
    if (family && product.family !== family) return false;
    if (!query.trim()) return true;
    const text = product.translations[locale];
    const haystack = normalize(
      [
        product.partNumber,
        product.family,
        text.name,
        text.description,
        text.application,
        ...text.features
      ].join(" ")
    );
    return haystack.includes(normalize(query));
  });

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
        <div
          className="absolute -right-16 -top-16 text-white/[0.06]"
          aria-hidden
        >
          <BearingMark className="h-64 w-64" />
        </div>
        <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-accent-400">
          {t("eyebrow")}
        </p>
        <h1 className="relative mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
        <p className="relative mt-2 max-w-2xl text-blue-100/85">
          {t("subtitle")}
        </p>
        <label
          className="relative mt-6 block max-w-xl"
          htmlFor="catalog-search"
        >
          <span className="sr-only">{common("search")}</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            className="pl-12 text-slate-900"
            id="catalog-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            type="search"
            value={query}
          />
        </label>
      </section>

      <section aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
        {[undefined, ...families].map((option) => (
          <button
            aria-pressed={family === option}
            className={cn(
              "min-h-10 rounded-full border px-4 text-sm font-semibold transition",
              family === option
                ? "border-navy-700 bg-navy-700 text-white"
                : "bg-white text-slate-700 hover:border-navy-600"
            )}
            key={option ?? "all"}
            onClick={() => setFamily(option)}
            type="button"
          >
            {option ?? common("all")}
          </button>
        ))}
      </section>

      <section>
        <p className="mb-3 text-sm font-semibold text-slate-500">
          {t("results", { count: visible.length })}
        </p>
        {visible.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => {
              const text = product.translations[locale];
              return (
                <Link
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition hover:-translate-y-0.5 hover:border-navy-600 hover:shadow-lift"
                  href={`/products/${product.partNumber}`}
                  key={product.id}
                >
                  <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-navy-50 via-white to-accent-50">
                    <BearingMark className="h-20 w-20 text-navy-700 transition duration-700 group-hover:rotate-45" />
                    <span className="absolute left-4 top-4 rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-navy-700 shadow-sm">
                      {product.partNumber}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-accent-600">
                      {product.family}
                    </p>
                    <h2 className="mt-1 font-bold">{text.name}</h2>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-slate-600">
                      {text.application}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy-700">
                      {t("open")}
                      <ArrowRight
                        className="h-4 w-4 transition group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-white p-8 text-center">
            <p className="font-bold">{t("emptyTitle")}</p>
            <p className="mt-1 text-sm text-slate-600">{t("emptyText")}</p>
            <button
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold"
              onClick={() => {
                setQuery("");
                setFamily(undefined);
              }}
              type="button"
            >
              <X className="h-4 w-4" aria-hidden />
              {t("clear")}
            </button>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold">{t("linesTitle")}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("linesSubtitle")}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {lines.map((line) => (
            <div className="rounded-xl border bg-white p-4" key={line.title}>
              <p className="font-bold text-navy-900">{line.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {line.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
