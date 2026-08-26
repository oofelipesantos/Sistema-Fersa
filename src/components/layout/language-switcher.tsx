"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, locales } from "@/i18n/routing";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");
  return (
    <div className="flex items-center gap-1">
      {!compact && (
        <Languages
          className="hidden h-5 w-5 text-slate-500 sm:block"
          aria-hidden
        />
      )}
      <select
        aria-label={t("language")}
        className="h-12 w-20 rounded-lg border bg-white px-2 text-base font-bold text-slate-700"
        onChange={(event) =>
          router.replace(pathname, { locale: event.target.value as Locale })
        }
        value={locale}
      >
        {locales.map((option) => (
          <option key={option} value={option}>
            {option === "pt-BR" ? "PT" : option.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
