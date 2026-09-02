"use client";

import {
  BarChart3,
  CalendarCheck2,
  CircleGauge,
  Clock3,
  Languages,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  UserRoundCheck,
  Wrench
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-context";
import { Link } from "@/i18n/navigation";
import { isMockMode } from "@/lib/utils";
import {
  getProductRepository,
  getTicketRepository
} from "@/repositories/repository-factory";
import type {
  Locale,
  Product,
  TechnicianSummary,
  Ticket
} from "@/types/domain";
import { StatusBadge } from "@/components/tickets/ticket-badges";
import { TicketList } from "@/components/tickets/ticket-list";

export function MyWorkPage() {
  const t = useTranslations("operations");
  const { session } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>();
  useEffect(() => {
    void getTicketRepository().list().then(setTickets);
  }, []);
  const queue = useMemo(() => {
    if (!tickets || !session) return [];
    if (session.user.role === "TECHNICIAN") return tickets;
    return tickets.filter(
      (ticket) =>
        ticket.assigneeName === session.user.fullName ||
        ["NEW", "WAITING_SUPPORT", "WAITING_TECHNICIAN"].includes(ticket.status)
    );
  }, [session, tickets]);
  return (
    <Page title={t("myWorkTitle")} subtitle={t("myWorkSubtitle")}>
      {tickets ? <TicketList table tickets={queue} /> : <Loading />}
    </Page>
  );
}

export function TechniciansPage() {
  const t = useTranslations("operations");
  const common = useTranslations("common");
  const [technicians, setTechnicians] = useState<TechnicianSummary[]>();
  useEffect(() => {
    void getTicketRepository().listTechnicians().then(setTechnicians);
  }, []);
  return (
    <Page title={t("techniciansTitle")} subtitle={t("techniciansSubtitle")}>
      {technicians ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {technicians.map((technician) => (
            <Card key={technician.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-xl bg-navy-50 p-3 text-navy-700">
                    <Wrench className="h-6 w-6" aria-hidden />
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      technician.availability === "AVAILABLE"
                        ? "bg-emerald-100 text-emerald-800"
                        : technician.availability === "BUSY"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-steel-100 text-slate-600"
                    }`}
                  >
                    {t(`availability_${technician.availability}`)}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-bold">
                  {technician.fullName}
                </h2>
                <p className="text-sm text-slate-500">{technician.region}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {technician.specialties.map((specialty) => (
                    <span
                      className="rounded-full bg-steel-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                      key={specialty}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-3 border-y py-4">
                  <Metric
                    label={t("activeCases")}
                    value={technician.activeTicketCount}
                  />
                  <Metric
                    label={t("resolvedCases")}
                    value={technician.resolvedTicketCount}
                  />
                </dl>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Languages className="h-4 w-4" aria-hidden />
                    {technician.preferredLocale === "pt-BR"
                      ? common("portuguese")
                      : technician.preferredLocale === "es"
                        ? common("spanish")
                        : common("english")}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden />
                    {technician.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" aria-hidden />
                    {technician.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </Page>
  );
}

export function ReportsPage() {
  const t = useTranslations("operations");
  const [tickets, setTickets] = useState<Ticket[]>();
  useEffect(() => {
    void getTicketRepository().list().then(setTickets);
  }, []);
  const report = useMemo(() => {
    const data = tickets ?? [];
    const resolved = data.filter((ticket) => ticket.status === "RESOLVED");
    const resolvedWithTechnician = resolved.filter((ticket) =>
      ticket.history.some((item) => item.action === "TECHNICIAN_ASSIGNED")
    ).length;
    const supportQueue = data.filter((ticket) =>
      ["NEW", "WAITING_SUPPORT", "IN_PROGRESS", "WAITING_CUSTOMER"].includes(
        ticket.status
      )
    ).length;
    const technicalQueue = data.filter((ticket) =>
      [
        "WAITING_TECHNICIAN",
        "TECHNICIAN_ASSIGNED",
        "VISIT_REQUIRED",
        "VISIT_SCHEDULED"
      ].includes(ticket.status)
    ).length;
    const total = data.length || 1;
    return {
      total: data.length,
      supportQueue,
      technicalQueue,
      resolved: resolved.length,
      resolvedWithTechnician,
      resolvedBySupport: Math.max(resolved.length - resolvedWithTechnician, 0),
      escalationRate: Math.round(
        (data.filter((ticket) =>
          ticket.history.some((item) => item.action === "TECHNICIAN_ASSIGNED")
        ).length /
          total) *
          100
      )
    };
  }, [tickets]);
  const funnel = [
    { label: t("reportReceived"), value: report.total, color: "bg-navy-700" },
    {
      label: t("reportSupportQueue"),
      value: report.supportQueue,
      color: "bg-blue-500"
    },
    {
      label: t("reportTechnicalQueue"),
      value: report.technicalQueue,
      color: "bg-amber-500"
    },
    {
      label: t("reportResolved"),
      value: report.resolved,
      color: "bg-emerald-600"
    }
  ];
  return (
    <Page title={t("reportsTitle")} subtitle={t("reportsSubtitle")}>
      {tickets ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ReportCard
              icon={BarChart3}
              label={t("reportReceived")}
              value={report.total}
            />
            <ReportCard
              icon={CircleGauge}
              label={t("reportEscalationRate")}
              value={`${report.escalationRate}%`}
            />
            <ReportCard
              icon={UserRoundCheck}
              label={t("reportResolvedSupport")}
              value={report.resolvedBySupport}
            />
            <ReportCard
              icon={Wrench}
              label={t("reportResolvedTechnician")}
              value={report.resolvedWithTechnician}
            />
          </div>
          <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            <Card>
              <CardHeader>
                <h2 className="font-bold">{t("reportFlowTitle")}</h2>
                <p className="text-sm text-slate-500">
                  {t("reportFlowSubtitle")}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {funnel.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between gap-3 text-sm">
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-steel-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{
                          width: `${Math.max((item.value / Math.max(report.total, 1)) * 100, item.value ? 8 : 0)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="font-bold">{t("reportReadingTitle")}</h2>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-6 text-slate-600">
                <p>{t("reportReading1")}</p>
                <p>{t("reportReading2")}</p>
                <p className="rounded-lg bg-navy-50 p-3 font-semibold text-navy-900">
                  {t("reportDemoNotice")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </Page>
  );
}

export function VisitsPage() {
  const t = useTranslations("operations");
  const ticketT = useTranslations("ticket");
  const locale = useLocale() as Locale;
  const [tickets, setTickets] = useState<Ticket[]>();
  useEffect(() => {
    void getTicketRepository()
      .list()
      .then((items) =>
        setTickets(
          items.filter((ticket) =>
            ["VISIT_REQUIRED", "VISIT_SCHEDULED"].includes(ticket.status)
          )
        )
      );
  }, []);
  return (
    <Page title={t("visitsTitle")} subtitle={t("visitsSubtitle")}>
      {tickets ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-navy-700">
                      {ticketT("number", { number: ticket.number })}
                    </p>
                    <h2 className="mt-1 text-lg font-bold">
                      {ticket.productPartNumber} · {ticket.issueTitle[locale]}
                    </h2>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
                <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                  <VisitDetail
                    icon={UserRoundCheck}
                    label={ticketT("assignee")}
                    value={ticket.assigneeName ?? t("unassigned")}
                  />
                  <VisitDetail
                    icon={MapPin}
                    label={ticketT("location")}
                    value={ticket.location ?? t("unassigned")}
                  />
                  <VisitDetail
                    icon={CalendarCheck2}
                    label={t("scheduledFor")}
                    value={
                      ticket.visitScheduledAt
                        ? new Intl.DateTimeFormat(locale, {
                            dateStyle: "medium",
                            timeStyle: "short"
                          }).format(new Date(ticket.visitScheduledAt))
                        : t("awaitingSchedule")
                    }
                  />
                  <VisitDetail
                    icon={Package}
                    label={ticketT("equipment")}
                    value={ticket.equipment ?? t("unassigned")}
                  />
                </dl>
                <Link
                  className="mt-5 inline-flex min-h-12 items-center font-bold text-navy-700"
                  href={`/service/tickets/${ticket.id}`}
                >
                  {t("openCase")}
                </Link>
              </CardContent>
            </Card>
          ))}
          {tickets.length === 0 && <Empty text={t("visitsEmpty")} />}
        </div>
      ) : (
        <Loading />
      )}
    </Page>
  );
}

export function ProductsPage() {
  const t = useTranslations("operations");
  const locale = useLocale() as Locale;
  const [products, setProducts] = useState<Product[]>();
  useEffect(() => {
    void getProductRepository().list().then(setProducts);
  }, []);
  return (
    <Page title={t("productsTitle")} subtitle={t("productsSubtitle")}>
      {products ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <span className="rounded-xl bg-navy-50 p-3 text-navy-700">
                    <Package className="h-6 w-6" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-navy-700">
                      {product.partNumber}
                    </p>
                    <h2 className="mt-1 font-bold">
                      {product.translations[locale].name}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.translations[locale].application}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4 text-sm">
                      <span className="text-slate-500">{product.family}</span>
                      <Link
                        className="font-bold text-navy-700"
                        href={`/products/${product.partNumber}`}
                      >
                        {t("openProduct")}
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </Page>
  );
}

export function SettingsPage() {
  const t = useTranslations("operations");
  const rows = [
    {
      icon: ShieldCheck,
      title: t("settingsDataTitle"),
      description: isMockMode()
        ? t("settingsMockDescription")
        : t("settingsSupabaseDescription"),
      status: isMockMode() ? t("settingsDemo") : t("settingsConnected")
    },
    {
      icon: Languages,
      title: t("settingsLanguagesTitle"),
      description: t("settingsLanguagesDescription"),
      status: "PT · ES · EN"
    },
    {
      icon: Clock3,
      title: t("settingsSlaTitle"),
      description: t("settingsSlaDescription"),
      status: t("settingsPilot")
    }
  ];
  return (
    <Page title={t("settingsTitle")} subtitle={t("settingsSubtitle")}>
      <div className="space-y-3">
        {rows.map(({ icon: Icon, title, description, status }) => (
          <Card key={title}>
            <CardContent className="flex flex-wrap items-center gap-4 p-5">
              <span className="rounded-xl bg-navy-50 p-3 text-navy-700">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold">{title}</h2>
                <p className="mt-1 text-sm text-slate-600">{description}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-800">
                {status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function Page({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 max-w-3xl text-base text-slate-600">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Loading() {
  const common = useTranslations("common");
  return (
    <Card>
      <CardContent className="p-8 text-center text-sm text-slate-500">
        {common("loading")}
      </CardContent>
    </Card>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="p-8 text-center text-sm text-slate-500">
        {text}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-bold">{value}</dd>
    </div>
  );
}

function ReportCard({
  icon: Icon,
  label,
  value
}: {
  icon: typeof BarChart3;
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="rounded-lg bg-navy-50 p-2 text-navy-700">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-xl font-bold">{value}</p>
        </span>
      </CardContent>
    </Card>
  );
}

function VisitDetail({
  icon: Icon,
  label,
  value
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon className="h-4 w-4" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}
