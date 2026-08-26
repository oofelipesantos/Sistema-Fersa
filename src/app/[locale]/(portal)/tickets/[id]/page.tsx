import { ProtectedTicketDetail } from "@/components/tickets/protected-ticket-pages";
import { ProtectedRoute } from "@/features/auth/protected-route";
import type { Locale } from "@/types/domain";

export default async function TicketPage({
  params
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const { id, locale } = await params;
  return (
    <ProtectedRoute>
      <ProtectedTicketDetail id={id} locale={locale} />
    </ProtectedRoute>
  );
}
