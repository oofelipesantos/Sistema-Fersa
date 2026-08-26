import { isMockMode } from "@/lib/utils";
import type {
  KnowledgeBaseRepository,
  ProductRepository,
  TicketRepository
} from "./contracts";
import { MockKnowledgeBaseRepository } from "./mock/mock-knowledge-base-repository";
import { MockProductRepository } from "./mock/mock-product-repository";
import { MockTicketRepository } from "./mock/mock-ticket-repository";
import { SupabaseKnowledgeBaseRepository } from "./supabase/supabase-knowledge-base-repository";
import { SupabaseProductRepository } from "./supabase/supabase-product-repository";
import { SupabaseTicketRepository } from "./supabase/supabase-ticket-repository";

export function getProductRepository(): ProductRepository {
  return isMockMode()
    ? new MockProductRepository()
    : new SupabaseProductRepository();
}
export function getKnowledgeBaseRepository(): KnowledgeBaseRepository {
  return isMockMode()
    ? new MockKnowledgeBaseRepository()
    : new SupabaseKnowledgeBaseRepository();
}
export function getTicketRepository(): TicketRepository {
  return isMockMode()
    ? new MockTicketRepository()
    : new SupabaseTicketRepository();
}
