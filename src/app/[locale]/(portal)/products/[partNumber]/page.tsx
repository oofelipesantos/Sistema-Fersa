import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/portal/product-detail";
import {
  getKnowledgeBaseRepository,
  getProductRepository
} from "@/repositories/repository-factory";
import type { Locale } from "@/types/domain";

export default async function ProductPage({
  params
}: {
  params: Promise<{ locale: Locale; partNumber: string }>;
}) {
  const { locale, partNumber } = await params;
  const product = await getProductRepository().findByPartNumber(partNumber);
  if (!product) notFound();
  const issues = await getKnowledgeBaseRepository().listKnownIssues(product.id);
  return <ProductDetail issues={issues} locale={locale} product={product} />;
}
