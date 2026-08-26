import { TicketWizard } from "@/components/tickets/ticket-wizard";
import { ProtectedRoute } from "@/features/auth/protected-route";
import {
  getKnowledgeBaseRepository,
  getProductRepository
} from "@/repositories/repository-factory";
import type { Locale } from "@/types/domain";

export default async function NewTicketPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [products, categories] = await Promise.all([
    getProductRepository().list(),
    getKnowledgeBaseRepository().listCategories()
  ]);
  return (
    <ProtectedRoute>
      <TicketWizard
        categories={categories}
        locale={locale}
        products={products}
      />
    </ProtectedRoute>
  );
}
