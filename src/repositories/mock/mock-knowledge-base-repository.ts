import type { KnowledgeBaseRepository } from "@/repositories/contracts";
import { mockCategories, mockKnownIssues } from "./mock-data";

export class MockKnowledgeBaseRepository implements KnowledgeBaseRepository {
  async listCategories() {
    return mockCategories;
  }
  async listKnownIssues(productId: string) {
    return mockKnownIssues.filter((issue) => issue.productId === productId);
  }
}
