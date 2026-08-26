import { KnowledgeBase } from "@/components/portal/knowledge-base";
import {
  getKnowledgeBaseRepository,
  getProductRepository
} from "@/repositories/repository-factory";
import type { Locale } from "@/types/domain";

export default async function KnowledgePage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const products = await getProductRepository().list();
  const issues = (
    await Promise.all(
      products.map((product) =>
        getKnowledgeBaseRepository().listKnownIssues(product.id)
      )
    )
  ).flat();
  return <KnowledgeBase issues={issues} locale={locale} products={products} />;
}
