import type { TicketRepository } from "@/repositories/contracts";
import type { CreateTicketInput, Ticket } from "@/types/domain";
import { mockCategories, mockProducts } from "./mock-data";
import {
  canAccessTicket,
  isInternalRole
} from "@/features/auth/access-control";
import { readMockSession, readMockState, writeMockState } from "./mock-store";

export class MockTicketRepository implements TicketRepository {
  async list() {
    const session = readMockSession();
    if (!session) throw new Error("AUTHENTICATION_REQUIRED");
    const tickets = readMockState().tickets.filter((ticket) =>
      isInternalRole(session.user.role)
        ? canAccessTicket(session, ticket.customerId, ticket.assigneeName)
        : ticket.customerId === session.user.id
    );
    return tickets.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
  async findById(id: string) {
    const session = readMockSession();
    if (!session) throw new Error("AUTHENTICATION_REQUIRED");
    const ticket =
      readMockState().tickets.find((candidate) => candidate.id === id) ?? null;
    if (
      !ticket ||
      !canAccessTicket(session, ticket.customerId, ticket.assigneeName)
    )
      return null;
    return ticket;
  }
  async getDashboardMetrics() {
    const tickets = await this.list();
    const count = (status: Ticket["status"]) =>
      tickets.filter((ticket) => ticket.status === status).length;
    const total = tickets.length || 1;
    return {
      newTickets: count("NEW"),
      inProgress: count("IN_PROGRESS"),
      waitingCustomer: count("WAITING_CUSTOMER"),
      waitingTechnician: count("WAITING_TECHNICIAN"),
      resolvedToday: 0,
      resolvedMonth: count("RESOLVED"),
      averageResponseHours: 3.4,
      selfServiceRate: 41,
      languages: (["pt-BR", "es", "en"] as const).map((locale) => ({
        locale,
        percentage: Math.round(
          (tickets.filter((ticket) => ticket.locale === locale).length /
            total) *
            100
        )
      }))
    };
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const session = readMockSession();
    if (!session) throw new Error("AUTHENTICATION_REQUIRED");
    if (isInternalRole(session.user.role))
      throw new Error("CUSTOMER_ACCOUNT_REQUIRED");
    const state = readMockState();
    const product = mockProducts.find((item) => item.id === input.productId);
    const category = mockCategories.find(
      (item) => item.id === input.categoryId
    );
    if (!product || !category) throw new Error("MOCK_REFERENCE_NOT_FOUND");
    const nextNumber =
      Math.max(...state.tickets.map((ticket) => ticket.number), 0) + 1;
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: `ticket-${nextNumber}`,
      number: nextNumber,
      customerId: session.user.id,
      organizationId: session.user.organizationId,
      customerName: session.user.fullName,
      organizationName: session.organization?.name ?? "",
      role: session.user.role,
      country: input.country || "Not informed",
      locale: input.locale,
      productId: product.id,
      productPartNumber: product.partNumber,
      issueTitle: category.translations,
      description: input.description,
      status: "NEW",
      priority: "MEDIUM",
      branchName: "Regional team (demo)",
      updatedAt: now,
      createdAt: now,
      equipment: input.equipment || undefined,
      serialNumber: input.serialNumber || undefined,
      location: [input.city, input.state, input.country]
        .filter(Boolean)
        .join(", "),
      messages: [],
      history: [
        {
          id: `${nextNumber}-created`,
          action: "TICKET_CREATED",
          createdAt: now
        }
      ],
      attachments: []
    };
    state.tickets.unshift(ticket);
    writeMockState(state);
    return ticket;
  }

  async addAttachments(ticketId: string, files: File[]) {
    if (files.length === 0) return;
    const session = readMockSession();
    const state = readMockState();
    const ticket = state.tickets.find((candidate) => candidate.id === ticketId);
    if (!session || !ticket || ticket.customerId !== session.user.id)
      throw new Error("ACCESS_DENIED");
    const now = new Date().toISOString();
    ticket.attachments.push(
      ...files.map((file, index) => ({
        id: `${ticketId}-attachment-${Date.now()}-${index}`,
        fileName: file.name,
        contentType: file.type || undefined,
        sizeBytes: file.size,
        createdAt: now
      }))
    );
    writeMockState(state);
  }
}
