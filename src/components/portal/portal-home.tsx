"use client";

import {
  BookOpen,
  Package,
  Presentation,
  ChevronRight,
  CircleHelp,
  ScanLine,
  Search,
  Ticket as TicketIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BearingMark } from "@/components/layout/bearing-mark";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/tickets/ticket-badges";
import { PartNumberFinder } from "./part-number-finder";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { getTicketRepository } from "@/repositories/repository-factory";
import type { Locale, Ticket } from "@/types/domain";

export function PortalHome({ locale }: { locale: Locale }) {
  const t = useTranslations("portal");
  const nav = useTranslations("nav");
  const ticketT = useTranslations("ticket");
  const { session } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    if (!session) return;
    getTicketRepository()
      .list()
      .then(setTickets)
      .catch(() => setTickets([]));
  }, [session]);
  const visibleTickets = session ? tickets : [];
  const actions = [
    {
      href: "/scan",
      title: t("scanTitle"),
      description: t("scanDescription"),
      icon: ScanLine
    },
    {
      href: "/products",
      title: t("partTitle"),
      description: t("partDescription"),
      icon: Search
    },
    {
      href: "/tickets",
      title: t("ticketsTitle"),
      description: t("ticketsDescription"),
      icon: TicketIcon
    },
    {
      href: "/knowledge-base",
      title: t("knowledgeTitle"),
      description: t("knowledgeDescription"),
      icon: BookOpen
    },
    {
      href: "/tickets/new",
      title: t("supportTitle"),
      description: t("supportDescription"),
      icon: CircleHelp
    }
  ];
  return (
    <div className="space-y-6">
      <section className="relative isolate overflow-hidden rounded-2xl bg-navy-900 text-white shadow-lift">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div
          className="absolute -right-24 -top-24 -z-10 text-white/[0.06]"
          aria-hidden
        >
          <BearingMark className="h-96 w-96 animate-spin-slow" />
        </div>
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-accent-400">
              {session
                ? t("greeting", { name: session.user.fullName.split(" ")[0] })
                : t("welcome")}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("question")}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-blue-100/85">
              {session?.organization?.verificationStatus === "PENDING"
                ? t("pendingVerification")
                : session
                  ? t("signedInNotice", {
                      organization: session.organization?.name ?? ""
                    })
                  : t("publicNotice")}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent-500 px-4 font-bold text-white transition hover:bg-accent-600"
                href="/scan"
              >
                <ScanLine className="h-5 w-5" aria-hidden />
                {t("scanTitle")}
              </Link>
              <Link
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/20 px-4 font-bold text-white transition hover:bg-white/10"
                href="/products"
              >
                <Package className="h-5 w-5" aria-hidden />
                {t("catalogCta")}
              </Link>
            </div>
          </div>
          <div className="rounded-xl bg-white p-4 text-slate-900">
            <PartNumberFinder
              label={t("findProduct")}
              placeholder={t("partNumberPlaceholder")}
            />
            <p className="mt-1 text-xs text-slate-500">{t("tryExamples")}</p>
          </div>
        </div>
      </section>
      {session && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">{t("recentTickets")}</h2>
            <Link
              className="text-sm font-semibold text-navy-700"
              href="/tickets"
            >
              {nav("myTickets")}
            </Link>
          </div>
          <div className="space-y-3">
            {visibleTickets.slice(0, 2).map((ticket) => (
              <Link
                className="block"
                href={`/tickets/${ticket.id}`}
                key={ticket.id}
              >
                <Card className="transition hover:border-navy-600">
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold">
                        {ticketT("number", { number: ticket.number })}
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-600">
                        {ticket.productPartNumber} · {ticket.issueTitle[locale]}
                      </p>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="grid gap-3 sm:grid-cols-2">
        {actions.slice(1).map(({ href, title, description, icon: Icon }) => (
          <Link
            className="group flex items-center gap-3 rounded-xl border bg-white p-4 shadow-card transition hover:border-navy-600"
            href={href}
            key={title}
          >
            <span className="rounded-lg bg-navy-50 p-2 text-navy-700">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{title}</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {description}
              </span>
            </span>
            <ChevronRight
              className="h-4 w-4 text-slate-400 group-hover:text-navy-700"
              aria-hidden
            />
          </Link>
        ))}
      </section>
      <Link
        className="group flex items-center gap-4 rounded-xl border border-dashed border-navy-200 bg-navy-50/60 p-4 transition hover:border-navy-600"
        href="/pitch"
      >
        <span className="rounded-lg bg-navy-700 p-2 text-white">
          <Presentation className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-navy-900">
            {t("pitchTitle")}
          </span>
          <span className="mt-0.5 block text-xs text-slate-600">
            {t("pitchDescription")}
          </span>
        </span>
        <ChevronRight
          className="h-4 w-4 text-slate-400 group-hover:text-navy-700"
          aria-hidden
        />
      </Link>
    </div>
  );
}
