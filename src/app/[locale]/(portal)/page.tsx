import { PortalHome } from "@/components/portal/portal-home";
import { getTicketRepository } from "@/repositories/repository-factory";
import type { Locale } from "@/types/domain";

export default async function PortalPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const tickets = await getTicketRepository().list();
  return <PortalHome locale={locale} tickets={tickets} />;
}
