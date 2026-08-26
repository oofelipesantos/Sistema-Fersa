"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, locales } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels = { "pt-BR": "portuguese", es: "spanish", en: "english" } as const;

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  return (
    <div className="flex items-center gap-1" aria-label={t("language")}>
      {!compact && (
        <Languages className="mr-1 h-4 w-4 text-slate-500" aria-hidden />
      )}
      {locales.map((option) => (
        <button
          aria-label={t(labels[option])}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-semibold",
            option === locale
              ? "bg-navy-700 text-white"
              : "text-slate-600 hover:bg-steel-100"
          )}
          key={option}
          onClick={() => router.replace(pathname, { locale: option })}
          type="button"
        >
          {option === "pt-BR" ? "PT" : option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
