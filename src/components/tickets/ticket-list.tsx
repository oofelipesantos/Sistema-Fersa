"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import type { Locale, Ticket } from "@/types/domain";
import { StatusBadge } from "./ticket-badges";

export function TicketList({
  tickets,
  table = false
}: {
  tickets: Ticket[];
  table?: boolean;
}) {
  const [query, setQuery] = useState("");
  const locale = useLocale() as Locale;
  const t = useTranslations("ticket");
  const common = useTranslations("common");
  const results = useMemo(
    () =>
      tickets.filter((ticket) =>
        [
          ticket.number,
          ticket.customerName,
          ticket.productPartNumber,
          ticket.issueTitle[locale]
        ]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [tickets, query, locale]
  );
  return (
    <div className="space-y-4">
      <div className="relative max-w-lg">
        <Search
          className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400"
          aria-hidden
        />
        <Input
          aria-label={common("search")}
          className="pl-9"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          value={query}
        />
      </div>
      {table ? (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-card">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b bg-steel-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">{t("customer")}</th>
                <th className="p-4">{t("locale")}</th>
                <th className="p-4">{t("product")}</th>
                <th className="p-4">{t("issue")}</th>
                <th className="p-4">{t("status")}</th>
                <th className="p-4">{t("priority")}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((ticket) => (
                <tr
                  className="border-b last:border-0 hover:bg-steel-50"
                  key={ticket.id}
                >
                  <td className="p-4 font-bold">
                    <Link
                      className="text-navy-700"
                      href={`/service/tickets/${ticket.id}`}
                    >
                      {ticket.number}
                    </Link>
                  </td>
                  <td className="p-4">{ticket.customerName}</td>
                  <td className="p-4 uppercase">{ticket.locale}</td>
                  <td className="p-4">{ticket.productPartNumber}</td>
                  <td className="p-4">{ticket.issueTitle[locale]}</td>
                  <td className="p-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="p-4">{t(`priority_${ticket.priority}`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((ticket) => (
            <Link
              className="block"
              href={`/tickets/${ticket.id}`}
              key={ticket.id}
            >
              <Card className="hover:border-navy-600">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold">
                        {t("number", { number: ticket.number })}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {ticket.productPartNumber} · {ticket.issueTitle[locale]}
                      </p>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    {new Intl.DateTimeFormat(locale, {
                      dateStyle: "short",
                      timeStyle: "short"
                    }).format(new Date(ticket.updatedAt))}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {results.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-sm text-slate-500">
                {t("empty")}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
