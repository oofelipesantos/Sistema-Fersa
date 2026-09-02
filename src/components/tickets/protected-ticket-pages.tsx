"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/features/auth/protected-route";
import { Link } from "@/i18n/navigation";
import { getTicketRepository } from "@/repositories/repository-factory";
import type { Locale, Ticket } from "@/types/domain";
import { TicketDetail } from "./ticket-detail";
import { TicketList } from "./ticket-list";

export function MyTicketsPage() {
  const t = useTranslations("ticket");
  return (
    <ProtectedRoute>
      <TicketCollection title={t("title")} />
    </ProtectedRoute>
  );
}

export function InternalTicketsPage() {
  const t = useTranslations("ticket");
  return <TicketCollection internal title={t("title")} />;
}

function TicketCollection({
  internal = false,
  title
}: {
  internal?: boolean;
  title: string;
}) {
  const t = useTranslations("ticket");
  const [tickets, setTickets] = useState<Ticket[]>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    getTicketRepository()
      .list()
      .then((result) => active && setTickets(result))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, []);
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        {!internal && (
          <Link className={buttonVariants()} href="/tickets/new">
            <Plus className="h-5 w-5" aria-hidden />
            {t("new")}
          </Link>
        )}
      </div>
      {error ? (
        <Message>{t("loadError")}</Message>
      ) : tickets ? (
        <TicketList table={internal} tickets={tickets} />
      ) : (
        <Loading />
      )}
    </div>
  );
}

export function ProtectedTicketDetail({
  id,
  internal = false,
  locale
}: {
  id: string;
  internal?: boolean;
  locale: Locale;
}) {
  const t = useTranslations("ticket");
  const [ticket, setTicket] = useState<Ticket | null>();
  useEffect(() => {
    let active = true;
    getTicketRepository()
      .findById(id)
      .then((result) => active && setTicket(result))
      .catch(() => active && setTicket(null));
    return () => {
      active = false;
    };
  }, [id]);
  if (ticket === undefined) return <Loading />;
  if (!ticket) return <Message>{t("notFound")}</Message>;
  return (
    <TicketDetail
      internal={internal}
      locale={locale}
      onChange={setTicket}
      ticket={ticket}
    />
  );
}

function Loading() {
  const common = useTranslations("common");
  return (
    <div
      className="flex min-h-40 items-center justify-center gap-3 text-slate-700"
      role="status"
    >
      <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
      {common("loading")}
    </div>
  );
}

function Message({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent
        className="p-7 text-center text-base text-slate-700"
        role="alert"
      >
        {children}
      </CardContent>
    </Card>
  );
}
