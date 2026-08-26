"use client";

import {
  BookOpen,
  CircleHelp,
  House,
  PlusCircle,
  ScanLine,
  Ticket
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Brand } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { SignOutButton } from "./sign-out-button";

const navItems = [
  { href: "/", key: "home", icon: House },
  { href: "/scan", key: "scan", icon: ScanLine },
  { href: "/tickets", key: "myTickets", icon: Ticket },
  { href: "/knowledge-base", key: "knowledge", icon: BookOpen },
  { href: "/tickets/new", key: "support", icon: PlusCircle }
] as const;

export function PortalShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const pathname = usePathname();
  return (
    <div className="min-h-dvh bg-steel-50 pb-20 md:pb-0">
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Brand />
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 sm:inline">
              {common("demo")}
            </span>
            <LanguageSwitcher />
            <SignOutButton compact />
          </div>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </main>
      <nav
        className="safe-bottom fixed inset-x-0 bottom-0 z-20 border-t bg-white md:hidden"
        aria-label={common("openMenu")}
      >
        <div className="grid grid-cols-5">
          {navItems.map(({ href, key, icon: Icon }) => (
            <Link
              className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold ${pathname === href ? "text-navy-700" : "text-slate-500"}`}
              href={href}
              key={key}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span className="line-clamp-1">{t(key)}</span>
            </Link>
          ))}
        </div>
      </nav>
      <div className="fixed bottom-24 right-4 md:hidden">
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
