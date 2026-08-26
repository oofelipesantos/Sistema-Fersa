import { TicketWizard } from "@/components/tickets/ticket-wizard";
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
    <TicketWizard categories={categories} locale={locale} products={products} />
  );
}
