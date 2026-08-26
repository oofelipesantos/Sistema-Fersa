import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { TicketList } from "@/components/tickets/ticket-list";
import { Link } from "@/i18n/navigation";
import { getTicketRepository } from "@/repositories/repository-factory";

export default async function TicketsPage() {
  const t = await getTranslations("ticket");
  const tickets = await getTicketRepository().list();
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Link href="/tickets/new">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            {t("new")}
          </Button>
        </Link>
      </div>
      <TicketList tickets={tickets} />
    </div>
  );
}
