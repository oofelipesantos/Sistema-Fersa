import type { ProductRepository } from "@/repositories/contracts";
import { mockProducts } from "./mock-data";

export class MockProductRepository implements ProductRepository {
  async list() {
    return mockProducts;
  }
  async findByPartNumber(partNumber: string) {
    return (
      mockProducts.find(
        (product) =>
          product.partNumber.toLowerCase() === partNumber.toLowerCase()
      ) ?? null
    );
  }
  async findById(id: string) {
    return mockProducts.find((product) => product.id === id) ?? null;
  }
}
