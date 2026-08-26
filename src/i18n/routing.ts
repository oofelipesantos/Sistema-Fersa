import { defineRouting } from "next-intl/routing";

export const locales = ["pt-BR", "es", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "pt-BR",
  localePrefix: "always",
  localeDetection: true
});
