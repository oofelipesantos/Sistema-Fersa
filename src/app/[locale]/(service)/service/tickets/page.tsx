import { getTranslations } from "next-intl/server";
import { TicketList } from "@/components/tickets/ticket-list";
import { getTicketRepository } from "@/repositories/repository-factory";

export default async function ServiceTicketsPage() {
  const t = await getTranslations("ticket");
  const tickets = await getTicketRepository().list();
  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <div className="mt-6">
        <TicketList table tickets={tickets} />
      </div>
    </div>
  );
}
