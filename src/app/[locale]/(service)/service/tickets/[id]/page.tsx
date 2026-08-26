import { ProtectedTicketDetail } from "@/components/tickets/protected-ticket-pages";
import type { Locale } from "@/types/domain";

export default async function ServiceTicketPage({
  params
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const { id, locale } = await params;
  return <ProtectedTicketDetail id={id} internal locale={locale} />;
}
