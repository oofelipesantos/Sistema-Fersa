import { isMockMode } from "@/lib/utils";
import type {
  KnowledgeBaseRepository,
  OrganizationRepository,
  ProductRepository,
  TicketRepository
} from "./contracts";
import { MockKnowledgeBaseRepository } from "./mock/mock-knowledge-base-repository";
import { MockProductRepository } from "./mock/mock-product-repository";
import { MockTicketRepository } from "./mock/mock-ticket-repository";
import { MockOrganizationRepository } from "./mock/mock-organization-repository";
import { SupabaseKnowledgeBaseRepository } from "./supabase/supabase-knowledge-base-repository";
import { SupabaseProductRepository } from "./supabase/supabase-product-repository";
import { SupabaseTicketRepository } from "./supabase/supabase-ticket-repository";
import { SupabaseOrganizationRepository } from "./supabase/supabase-organization-repository";

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

export function getOrganizationRepository(): OrganizationRepository {
  return isMockMode()
    ? new MockOrganizationRepository()
    : new SupabaseOrganizationRepository();
}
