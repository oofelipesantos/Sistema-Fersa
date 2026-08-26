"use client";

import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  Cog,
  House,
  Package,
  Ticket,
  Users,
  Wrench
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { isMockMode } from "@/lib/utils";
import { Brand } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { SignOutButton } from "./sign-out-button";

const links = [
  { href: "/service", key: "dashboard", icon: House },
  { href: "/service/tickets", key: "tickets", icon: Ticket },
  { href: "/service/my-work", key: "myWork", icon: BriefcaseBusiness },
  { href: "/service/visits", key: "visits", icon: CalendarDays },
  { href: "/knowledge-base", key: "knowledge", icon: BookOpen },
  { href: "/service/customers", key: "customers", icon: Users },
  { href: "/service/products", key: "products", icon: Package },
  { href: "/service/technicians", key: "technicians", icon: Wrench },
  { href: "/service/reports", key: "reports", icon: ChartNoAxesCombined },
  { href: "/service/settings", key: "settings", icon: Cog }
] as const;

export function ServiceShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const pathname = usePathname();
  return (
    <ProtectedRoute roles={["SUPPORT", "TECHNICIAN", "ADMIN"]}>
      <div className="min-h-dvh bg-steel-50 lg:grid lg:grid-cols-[256px_1fr]">
        <aside className="hidden min-h-dvh border-r bg-white p-4 lg:block">
          <div className="mb-8">
            <Brand />
            <p className="mt-2 pl-10 text-xs text-slate-500">
              {t("serviceDesk")}
            </p>
          </div>
          <nav className="space-y-1">
            {links.map(({ href, key, icon: Icon }) => (
              <Link
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${pathname === href ? "bg-navy-50 text-navy-700" : "text-slate-600 hover:bg-steel-50"}`}
                href={href}
                key={key}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {t(key)}
              </Link>
            ))}
          </nav>
        </aside>
        <div>
          <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <Brand />
            </div>
            <div className="hidden items-center gap-2 text-sm font-semibold text-slate-600 lg:flex">
              <BarChart3 className="h-4 w-4" aria-hidden />
              {t("serviceDesk")}
            </div>
            <div className="flex items-center gap-3">
              {isMockMode() && (
                <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 sm:inline">
                  {common("demo")}
                </span>
              )}
              <LanguageSwitcher />
              <SignOutButton compact />
            </div>
          </header>
          <nav
            aria-label={t("serviceDesk")}
            className="overflow-x-auto border-b bg-white px-2 lg:hidden"
          >
            <div className="flex min-w-max gap-1 py-2">
              {links.map(({ href, key, icon: Icon }) => (
                <Link
                  className={`flex min-h-12 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${pathname === href ? "text-navy-800 bg-navy-50" : "text-slate-700"}`}
                  href={href}
                  key={key}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {t(key)}
                </Link>
              ))}
            </div>
          </nav>
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
