import type { TicketRepository } from "@/repositories/contracts";
import type { CreateTicketInput, Ticket } from "@/types/domain";
import {
  mockCategories,
  mockDashboardMetrics,
  mockProducts,
  mockTickets
} from "./mock-data";

export class MockTicketRepository implements TicketRepository {
  async list() {
    return [...mockTickets].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    );
  }
  async findById(id: string) {
    return mockTickets.find((ticket) => ticket.id === id) ?? null;
  }
  async getDashboardMetrics() {
    return mockDashboardMetrics;
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const product = mockProducts.find((item) => item.id === input.productId);
    const category = mockCategories.find(
      (item) => item.id === input.categoryId
    );
    if (!product || !category) throw new Error("MOCK_REFERENCE_NOT_FOUND");
    const nextNumber =
      Math.max(...mockTickets.map((ticket) => ticket.number)) + 1;
    const now = new Date().toISOString();
    const ticket: Ticket = {
      id: `ticket-${nextNumber}`,
      number: nextNumber,
      customerName: "Demo user",
      organizationName: "Demo organization",
      role: "MECHANIC",
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
      equipment: input.equipment,
      serialNumber: input.serialNumber,
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
      ]
    };
    mockTickets.unshift(ticket);
    return ticket;
  }
}
