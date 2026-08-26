import type { ProductRepository } from "@/repositories/contracts";
import { createSupabaseClient } from "@/lib/supabase";
import type { Locale, Product } from "@/types/domain";

type ProductRow = {
  id: string;
  part_number: string;
  family: string;
  image_url: string | null;
  active: boolean;
  product_translations: {
    locale: Locale;
    name: string;
    description: string;
    application: string;
    features: string[] | null;
  }[];
  product_documents: {
    id: string;
    locale: Locale;
    title: string;
    document_type: "MANUAL" | "TECHNICAL_SHEET" | "INSTALLATION";
    version: string;
    file_url: string;
  }[];
  product_videos: {
    id: string;
    locale: Locale;
    title: string;
    video_url: string;
  }[];
};

export class SupabaseProductRepository implements ProductRepository {
  private readonly client = createSupabaseClient();

  async list(): Promise<Product[]> {
    const { data, error } = await this.client
      .from("products")
      .select(
        "*, product_translations(*), product_documents(*), product_videos(*)"
      )
      .eq("active", true);
    if (error) throw error;
    return ((data ?? []) as unknown as ProductRow[]).map((row) =>
      this.map(row)
    );
  }

  async findByPartNumber(partNumber: string) {
    const products = await this.list();
    return (
      products.find(
        (product) =>
          product.partNumber.toLowerCase() === partNumber.toLowerCase()
      ) ?? null
    );
  }
  async findById(id: string) {
    const products = await this.list();
    return products.find((product) => product.id === id) ?? null;
  }

  private map(row: ProductRow): Product {
    return {
      id: row.id,
      partNumber: row.part_number,
      family: row.family,
      imageUrl: row.image_url ?? undefined,
      active: row.active,
      translations: Object.fromEntries(
        row.product_translations.map((item) => [
          item.locale,
          {
            name: item.name,
            description: item.description,
            application: item.application,
            features: item.features ?? []
          }
        ])
      ),
      documents: row.product_documents.map((item) => ({
        id: item.id,
        locale: item.locale,
        title: item.title,
        documentType: item.document_type,
        version: item.version,
        fileUrl: item.file_url
      })),
      videos: row.product_videos.map((item) => ({
        id: item.id,
        locale: item.locale,
        title: item.title,
        videoUrl: item.video_url
      }))
    } as Product;
  }
}
