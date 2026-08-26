"use client";

import { FileText, PlayCircle, Wrench } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { KnownIssue, Locale, Product } from "@/types/domain";

const tabs = [
  "information",
  "manuals",
  "videos",
  "knownIssues",
  "documents"
] as const;
export function ProductDetail({
  product,
  issues,
  locale
}: {
  product: Product;
  issues: KnownIssue[];
  locale: Locale;
}) {
  const t = useTranslations("product");
  const common = useTranslations("common");
  const [tab, setTab] = useState<(typeof tabs)[number]>("information");
  const content =
    product.translations[locale] ??
    product.translations.en ??
    product.translations["pt-BR"];
  const preferredDocuments = product.documents.filter(
    (document) => document.locale === locale
  );
  const documents = preferredDocuments.length
    ? preferredDocuments
    : product.documents.filter(
        (document) => document.locale === "en" || document.locale === "pt-BR"
      );
  const fallback = preferredDocuments.length === 0 && documents.length > 0;
  return (
    <div className="space-y-5">
      <section className="rounded-xl bg-navy-900 p-6 text-white">
        <p className="text-sm font-bold text-blue-200">{product.partNumber}</p>
        <h1 className="mt-1 text-2xl font-bold">{content.name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
          {content.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/tickets/new">
            <Button>{t("openTicket")}</Button>
          </Link>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 px-4 text-sm font-bold"
            href="/knowledge-base"
          >
            <Wrench className="h-4 w-4" aria-hidden />
            {t("startDiagnosis")}
          </Link>
        </div>
      </section>
      <div className="flex gap-1 overflow-x-auto border-b">
        {tabs.map((item) => (
          <button
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-bold ${tab === item ? "border-navy-700 text-navy-700" : "border-transparent text-slate-500"}`}
            key={item}
            onClick={() => setTab(item)}
            type="button"
          >
            {t(item)}
          </button>
        ))}
      </div>
      {tab === "information" && (
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2">
            <Info label={t("partNumber")} value={product.partNumber} />
            <Info label={t("family")} value={product.family} />
            <Info label={t("application")} value={content.application} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {t("features")}
              </p>
              <ul className="mt-2 space-y-1 text-sm">
                {content.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      {tab === "manuals" && (
        <Documents
          documents={documents.filter(
            (document) => document.documentType === "MANUAL"
          )}
          fallback={fallback}
          locale={locale}
        />
      )}
      {tab === "documents" && (
        <Documents documents={documents} fallback={fallback} locale={locale} />
      )}
      {tab === "videos" && (
        <div className="space-y-3">
          {product.videos.length ? (
            product.videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <PlayCircle className="h-6 w-6 text-navy-700" aria-hidden />
                  <span className="flex-1 text-sm font-bold">
                    {video.title}
                  </span>
                  <a
                    className="text-sm font-semibold text-navy-700"
                    href={video.videoUrl}
                  >
                    {common("viewAll")}
                  </a>
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty />
          )}
        </div>
      )}
      {tab === "knownIssues" && (
        <div className="space-y-3">
          {issues.length ? (
            issues.map((issue) => (
              <Card key={issue.id}>
                <CardContent className="p-5">
                  <h2 className="font-bold">
                    {issue.translations[locale]?.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {issue.translations[locale]?.description}
                  </p>
                  <p className="mt-4 text-sm font-bold">
                    {issue.steps.length} {t("startDiagnosis")}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Empty />
          )}
        </div>
      )}
    </div>
  );
  function Empty() {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-slate-500">
          {t("noContent")}
        </CardContent>
      </Card>
    );
  }
  function Documents({
    documents: items,
    fallback: useFallback,
    locale: documentLocale
  }: {
    documents: Product["documents"];
    fallback: boolean;
    locale: Locale;
  }) {
    return (
      <div className="space-y-3">
        {useFallback && (
          <p className="text-sm text-amber-700">
            {t("documentFallback", {
              locale:
                documentLocale === "es" ? common("english") : documentLocale
            })}
          </p>
        )}
        {items.length ? (
          items.map((document) => (
            <Card key={document.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <FileText className="h-6 w-6 text-navy-700" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{document.title}</p>
                  <p className="text-xs text-slate-500">
                    {document.version} · {document.locale}
                  </p>
                </div>
                <a
                  className="text-sm font-semibold text-navy-700"
                  href={document.fileUrl}
                >
                  {t("openDocument")}
                </a>
              </CardContent>
            </Card>
          ))
        ) : (
          <Empty />
        )}
      </div>
    );
  }
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}
