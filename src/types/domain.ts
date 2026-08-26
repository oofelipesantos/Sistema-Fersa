import type { Locale } from "@/i18n/routing";

export type { Locale };

export type UserRole =
  "DISTRIBUTOR" | "MECHANIC" | "SUPPORT" | "TECHNICIAN" | "ADMIN";
export type TicketStatus =
  | "NEW"
  | "WAITING_SUPPORT"
  | "IN_PROGRESS"
  | "WAITING_CUSTOMER"
  | "WAITING_TECHNICIAN"
  | "TECHNICIAN_ASSIGNED"
  | "VISIT_REQUIRED"
  | "VISIT_SCHEDULED"
  | "RESOLVED"
  | "CANCELLED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type MessageVisibility = "CUSTOMER" | "INTERNAL";
export type OrganizationType = "DISTRIBUTOR" | "WORKSHOP" | "CUSTOMER";

export type LocalizedText = Record<Locale, string>;

export interface ProductDocument {
  id: string;
  locale: Locale;
  title: string;
  documentType: "MANUAL" | "TECHNICAL_SHEET" | "INSTALLATION";
  version: string;
  fileUrl: string;
}

export interface ProductVideo {
  id: string;
  locale: Locale;
  title: string;
  videoUrl: string;
}

export interface Product {
  id: string;
  partNumber: string;
  family: string;
  imageUrl?: string;
  active: boolean;
  translations: Record<
    Locale,
    {
      name: string;
      description: string;
      application: string;
      features: string[];
    }
  >;
  documents: ProductDocument[];
  videos: ProductVideo[];
}

export interface IssueCategory {
  id: string;
  translations: LocalizedText;
}

export interface TroubleshootingStep {
  id: string;
  order: number;
  title: LocalizedText;
  description: LocalizedText;
  requiresConfirmation: boolean;
}

export interface KnownIssue {
  id: string;
  productId: string;
  categoryId: string;
  translations: Record<Locale, { title: string; description: string }>;
  steps: TroubleshootingStep[];
}

export interface TicketMessage {
  id: string;
  authorName: string;
  body: string;
  visibility: MessageVisibility;
  createdAt: string;
}

export interface TicketHistoryItem {
  id: string;
  action: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  number: number;
  customerName: string;
  organizationName: string;
  role: UserRole;
  country: string;
  locale: Locale;
  productId: string;
  productPartNumber: string;
  issueTitle: LocalizedText;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  branchName: string;
  assigneeName?: string;
  updatedAt: string;
  createdAt: string;
  equipment?: string;
  serialNumber?: string;
  location?: string;
  messages: TicketMessage[];
  history: TicketHistoryItem[];
}

export interface CreateTicketInput {
  productId: string;
  categoryId: string;
  description: string;
  equipment?: string;
  serialNumber?: string;
  lot?: string;
  hours?: number;
  quantity?: number;
  country?: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  locale: Locale;
}

export interface RoutingContext {
  country: string;
  state?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  productId: string;
  issueCategoryId: string;
  locale: Locale;
}

export interface RoutingResult {
  branchId?: string;
  branchName?: string;
  reason: string;
  confidence?: number;
}

export interface DashboardMetrics {
  newTickets: number;
  inProgress: number;
  waitingCustomer: number;
  waitingTechnician: number;
  resolvedToday: number;
  resolvedMonth: number;
  averageResponseHours: number;
  selfServiceRate: number;
  languages: { locale: Locale; percentage: number }[];
}
