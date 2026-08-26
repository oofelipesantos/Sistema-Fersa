"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Languages,
  TimerReset,
  UserRoundCheck
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import type { DashboardMetrics, Locale, Ticket } from "@/types/domain";
import { StatusBadge } from "@/components/tickets/ticket-badges";

export function Dashboard({
  metrics,
  tickets,
  locale
}: {
  metrics: DashboardMetrics;
  tickets: Ticket[];
  locale: Locale;
}) {
  const t = useTranslations("dashboard");
  const ticketT = useTranslations("ticket");
  const common = useTranslations("common");
  const cards = [
    { key: "newTickets", value: metrics.newTickets, icon: ArrowRight },
    { key: "inProgress", value: metrics.inProgress, icon: TimerReset },
    { key: "waitingCustomer", value: metrics.waitingCustomer, icon: Clock3 },
    {
      key: "waitingTechnician",
      value: metrics.waitingTechnician,
      icon: UserRoundCheck
    },
    { key: "resolvedToday", value: metrics.resolvedToday, icon: CheckCircle2 },
    { key: "resolvedMonth", value: metrics.resolvedMonth, icon: CheckCircle2 },
    {
      key: "averageResponse",
      value: t("hours", { value: metrics.averageResponseHours }),
      icon: Clock3
    },
    {
      key: "selfService",
      value: t("percent", { value: metrics.selfServiceRate }),
      icon: Languages
    }
  ] as const;
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, value, icon: Icon }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className="rounded-lg bg-navy-50 p-2 text-navy-700">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {t(key)}
                </p>
                <p className="mt-1 text-xl font-bold">{value}</p>
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold">{t("recentTickets")}</h2>
              <Link
                className="text-sm font-semibold text-navy-700"
                href="/service/tickets"
              >
                {t("seeTickets")}
              </Link>
            </div>
            <div className="divide-y">
              {tickets.map((ticket) => (
                <Link
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  href={`/service/tickets/${ticket.id}`}
                  key={ticket.id}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold">
                      {ticketT("number", { number: ticket.number })}{" "}
                      <span className="font-normal text-slate-500">
                        · {ticket.customerName}
                      </span>
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {ticket.productPartNumber} · {ticket.issueTitle[locale]}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h2 className="font-bold">{t("languageTickets")}</h2>
            <div className="mt-5 space-y-4">
              {metrics.languages.map((item) => (
                <div key={item.locale}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>
                      {item.locale === "pt-BR"
                        ? common("portuguese")
                        : item.locale === "es"
                          ? common("spanish")
                          : common("english")}
                    </span>
                    <span className="font-bold">
                      {t("percent", { value: item.percentage })}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-steel-100">
                    <div
                      className="h-2 rounded-full bg-navy-700"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
