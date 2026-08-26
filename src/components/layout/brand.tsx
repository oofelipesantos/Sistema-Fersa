import { CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Brand() {
  const t = useTranslations("common");
  return (
    <Link
      className="flex min-h-12 min-w-0 items-center gap-2 text-navy-900"
      href="/"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-700 text-white">
        <CircleHelp className="h-5 w-5" aria-hidden />
      </span>
      <span className="truncate text-sm font-extrabold tracking-wide">
        {t("brand")}
      </span>
    </Link>
  );
}
