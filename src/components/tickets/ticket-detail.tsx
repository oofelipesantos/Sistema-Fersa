"use client";

import {
  Clock3,
  MapPin,
  MessageSquare,
  Paperclip,
  UserRound
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PriorityBadge, StatusBadge } from "./ticket-badges";
import type { Locale, Ticket } from "@/types/domain";

export function TicketDetail({
  ticket,
  locale,
  internal = false
}: {
  ticket: Ticket;
  locale: Locale;
  internal?: boolean;
}) {
  const t = useTranslations("ticket");
  const common = useTranslations("common");
  const format = new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short"
  });
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-navy-700">
            {t("number", { number: ticket.number })}
          </p>
          <h1 className="mt-1 text-2xl font-bold">
            {ticket.issueTitle[locale]}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {ticket.productPartNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="font-bold">{t("details")}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {t("description")}
              </p>
              <p className="mt-1 text-sm leading-6">{ticket.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label={t("product")} value={ticket.productPartNumber} />
              <Detail
                label={t("equipment")}
                value={ticket.equipment || common("notAvailable")}
              />
              <Detail
                label={t("serialNumber")}
                value={ticket.serialNumber || common("notAvailable")}
              />
              <Detail label={t("locale")} value={ticket.locale.toUpperCase()} />
            </div>
            {internal && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail
                  label={t("customer")}
                  value={ticket.customerName}
                  icon={UserRound}
                />
                <Detail label={t("branch")} value={ticket.branchName} />
                <Detail
                  label={t("assignee")}
                  value={ticket.assigneeName ?? common("notAvailable")}
                />
                <Detail label={t("country")} value={ticket.country} />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="font-bold">{t("history")}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticket.history.map((item) => (
              <div className="flex gap-3" key={item.id}>
                <Clock3
                  className="mt-0.5 h-4 w-4 shrink-0 text-navy-700"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold">
                    {t.has(`history_${item.action}`)
                      ? t(`history_${item.action}`)
                      : item.action}
                  </p>
                  <p className="text-xs text-slate-500">
                    {format.format(new Date(item.createdAt))}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-bold">
              <MessageSquare className="h-4 w-4" aria-hidden />
              {t("messages")}
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticket.messages.length === 0 ? (
              <p className="text-sm text-slate-500">{common("notAvailable")}</p>
            ) : (
              ticket.messages.map((message) => (
                <div className="rounded-lg bg-steel-50 p-3" key={message.id}>
                  <p className="text-xs font-bold">{message.authorName}</p>
                  <p className="mt-1 text-sm">{message.body}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {format.format(new Date(message.createdAt))}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-bold">
              <Paperclip className="h-4 w-4" aria-hidden />
              {t("attachments")}
            </h2>
          </CardHeader>
          <CardContent>
            {ticket.attachments.length === 0 ? (
              <p className="text-sm text-slate-500">{common("notAvailable")}</p>
            ) : (
              <ul className="space-y-2">
                {ticket.attachments.map((attachment) => (
                  <li
                    className="rounded-lg bg-steel-50 p-3 text-sm"
                    key={attachment.id}
                  >
                    <p className="font-semibold">{attachment.fileName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {t("fileSize", {
                        value: Math.max(
                          1,
                          Math.round(attachment.sizeBytes / 1024)
                        )
                      })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      {ticket.location && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 text-navy-700" aria-hidden />
          {ticket.location}
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon?: typeof UserRound;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-1 text-sm">
        <>{Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}</>
        {value}
      </p>
    </div>
  );
}
