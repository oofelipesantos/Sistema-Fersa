import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BearingMark } from "./bearing-mark";

export function Brand({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("common");
  return (
    <Link
      className={`flex min-h-12 min-w-0 shrink-0 items-center gap-2.5 ${tone === "light" ? "text-white" : "text-navy-900"}`}
      href="/"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-700 text-white ring-1 ring-white/10">
        <BearingMark className="h-6 w-6" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-extrabold tracking-[0.14em]">
          {t("brand")}
        </span>
        <span
          className={`block truncate text-[11px] font-semibold tracking-wide ${tone === "light" ? "text-blue-200" : "text-accent-600"}`}
        >
          {t("product")}
        </span>
      </span>
    </Link>
  );
}
