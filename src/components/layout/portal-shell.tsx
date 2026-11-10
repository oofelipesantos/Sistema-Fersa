"use client";

import {
  BookOpen,
  CircleHelp,
  House,
  Package,
  Presentation,
  ScanLine,
  Ticket
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { isMockMode } from "@/lib/utils";
import { Brand } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { SignOutButton } from "./sign-out-button";

const navItems = [
  { href: "/", key: "home", icon: House },
  { href: "/products", key: "catalog", icon: Package },
  { href: "/scan", key: "scanShort", icon: ScanLine },
  { href: "/knowledge-base", key: "knowledge", icon: BookOpen },
  { href: "/tickets", key: "myTickets", icon: Ticket }
] as const;

export function PortalShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);
  return (
    <div className="min-h-dvh bg-steel-50 pb-20 lg:pb-0">
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Brand />
          <nav
            aria-label={common("openMenu")}
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          >
            {navItems.map(({ href, key }) => (
              <Link
                aria-current={isActive(href) ? "page" : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive(href) ? "bg-navy-50 text-navy-700" : "text-slate-600 hover:bg-steel-100 hover:text-navy-900"}`}
                href={href}
                key={key}
              >
                {t(key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              className="hidden min-h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-sm font-semibold text-navy-700 transition hover:border-navy-600 sm:inline-flex"
              href="/pitch"
            >
              <Presentation className="h-4 w-4" aria-hidden />
              {t("pitch")}
            </Link>
            {isMockMode() && (
              <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 sm:inline lg:hidden">
                {common("demo")}
              </span>
            )}
            <LanguageSwitcher />
            <SignOutButton compact />
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
      <nav
        className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t bg-white lg:hidden"
        aria-label={common("openMenu")}
      >
        <div className="grid grid-cols-5">
          {navItems.map(({ href, key, icon: Icon }) => (
            <Link
              aria-current={isActive(href) ? "page" : undefined}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold ${isActive(href) ? "text-navy-700" : "text-slate-500"}`}
              href={href}
              key={key}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="line-clamp-1">{t(key)}</span>
            </Link>
          ))}
        </div>
      </nav>
      <div className="fixed bottom-24 right-4 lg:hidden">
        <Link
          aria-label={t("support")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-700 text-white shadow-lg"
          href="/tickets/new"
        >
          <CircleHelp className="h-6 w-6" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
