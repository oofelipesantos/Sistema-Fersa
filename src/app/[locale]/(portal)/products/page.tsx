import { ProductCatalog } from "@/components/portal/product-catalog";
import { getProductRepository } from "@/repositories/repository-factory";
import type { Locale } from "@/types/domain";

export default async function ProductsPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const products = await getProductRepository().list();
  return <ProductCatalog locale={locale} products={products} />;
}
