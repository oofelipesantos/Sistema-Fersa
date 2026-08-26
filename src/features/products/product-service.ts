import { getProductRepository } from "@/repositories/repository-factory";

export async function getProductByPartNumber(partNumber: string) {
  return getProductRepository().findByPartNumber(partNumber);
}

export async function getProducts() {
  return getProductRepository().list();
}
