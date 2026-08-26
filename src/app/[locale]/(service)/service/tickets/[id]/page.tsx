import { notFound } from "next/navigation";
import { TicketDetail } from "@/components/tickets/ticket-detail";
import { getTicketRepository } from "@/repositories/repository-factory";
import type { Locale } from "@/types/domain";

export default async function ServiceTicketPage({
  params
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const { id, locale } = await params;
  const ticket = await getTicketRepository().findById(id);
  if (!ticket) notFound();
  return <TicketDetail internal locale={locale} ticket={ticket} />;
}
