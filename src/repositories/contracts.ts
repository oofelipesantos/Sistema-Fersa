import type {
  CreateTicketInput,
  DashboardMetrics,
  IssueCategory,
  KnownIssue,
  OrganizationWithUsers,
  Product,
  Ticket,
  VerificationStatus
} from "@/types/domain";

export interface ProductRepository {
  list(): Promise<Product[]>;
  findByPartNumber(partNumber: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
}

export interface KnowledgeBaseRepository {
  listCategories(): Promise<IssueCategory[]>;
  listKnownIssues(productId: string): Promise<KnownIssue[]>;
}

export interface TicketRepository {
  list(): Promise<Ticket[]>;
  findById(id: string): Promise<Ticket | null>;
  create(input: CreateTicketInput): Promise<Ticket>;
  addAttachments(ticketId: string, files: File[]): Promise<void>;
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export interface OrganizationRepository {
  listWithUsers(): Promise<OrganizationWithUsers[]>;
  updateVerification(
    organizationId: string,
    status: VerificationStatus
  ): Promise<void>;
}
