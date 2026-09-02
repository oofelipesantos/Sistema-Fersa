import type { TicketRepository } from "@/repositories/contracts";
import type {
  CreateTicketInput,
  Ticket,
  TicketHistoryItem,
  TicketMessage,
  TicketWorkflowAction,
  UserRole
} from "@/types/domain";
import { mockCategories, mockProducts, mockTechnicians } from "./mock-data";
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

  async listTechnicians() {
    const session = readMockSession();
    if (!session || !isInternalRole(session.user.role))
      throw new Error("ACCESS_DENIED");
    const tickets = readMockState().tickets;
    return mockTechnicians.map((technician) => ({
      ...technician,
      activeTicketCount: tickets.filter(
        (ticket) =>
          ticket.assigneeName === technician.fullName &&
          !["RESOLVED", "CANCELLED"].includes(ticket.status)
      ).length,
      resolvedTicketCount: tickets.filter(
        (ticket) =>
          ticket.assigneeName === technician.fullName &&
          ticket.status === "RESOLVED"
      ).length
    }));
  }

  async applyWorkflow(ticketId: string, action: TicketWorkflowAction) {
    const session = readMockSession();
    if (!session || !isInternalRole(session.user.role))
      throw new Error("ACCESS_DENIED");
    const state = readMockState();
    const ticket = state.tickets.find((candidate) => candidate.id === ticketId);
    if (
      !ticket ||
      !canAccessTicket(session, ticket.customerId, ticket.assigneeName)
    )
      throw new Error("TICKET_NOT_FOUND");
    const now = new Date().toISOString();
    const actor = session.user.fullName;
    const history = (name: string): TicketHistoryItem => ({
      id: `${ticket.id}-${name.toLowerCase()}-${Date.now()}`,
      action: name,
      createdAt: now
    });
    const message = (
      body: string,
      visibility: TicketMessage["visibility"] = "CUSTOMER"
    ): TicketMessage => ({
      id: `${ticket.id}-message-${Date.now()}-${ticket.messages.length}`,
      authorName: actor,
      body: body.trim(),
      visibility,
      createdAt: now
    });
    const requireRole = (roles: UserRole[]) => {
      if (!roles.includes(session.user.role)) throw new Error("ACCESS_DENIED");
    };
    const ensureOpen = () => {
      if (["RESOLVED", "CANCELLED"].includes(ticket.status))
        throw new Error("TICKET_CLOSED");
    };

    switch (action.type) {
      case "TAKE":
        requireRole(["SUPPORT", "ADMIN"]);
        ensureOpen();
        ticket.assigneeName = actor;
        ticket.status = "IN_PROGRESS";
        ticket.history.push(history("SUPPORT_ASSIGNED"));
        break;
      case "REPLY":
        ensureOpen();
        if (!action.message.trim()) throw new Error("MESSAGE_REQUIRED");
        ticket.messages.push(message(action.message, action.visibility));
        if (ticket.status === "NEW" || ticket.status === "WAITING_CUSTOMER")
          ticket.status = "IN_PROGRESS";
        if (!ticket.assigneeName) ticket.assigneeName = actor;
        ticket.history.push(history("MESSAGE_SENT"));
        break;
      case "REQUEST_INFORMATION":
        requireRole(["SUPPORT", "ADMIN"]);
        ensureOpen();
        if (!action.message.trim()) throw new Error("MESSAGE_REQUIRED");
        ticket.messages.push(message(action.message));
        ticket.assigneeName = actor;
        ticket.status = "WAITING_CUSTOMER";
        ticket.history.push(history("CUSTOMER_INFORMATION_REQUESTED"));
        break;
      case "ASSIGN_TECHNICIAN": {
        requireRole(["SUPPORT", "ADMIN"]);
        ensureOpen();
        const technician = state.users.find(
          (user) =>
            user.id === action.technicianId &&
            user.role === "TECHNICIAN" &&
            user.active
        );
        if (!technician) throw new Error("TECHNICIAN_NOT_FOUND");
        ticket.assigneeName = technician.fullName;
        ticket.status = "TECHNICIAN_ASSIGNED";
        ticket.messages.push(
          message(
            action.note?.trim() ||
              `A solicitação foi encaminhada para ${technician.fullName}, que dará continuidade à análise técnica.`
          )
        );
        ticket.history.push(history("TECHNICIAN_ASSIGNED"));
        break;
      }
      case "MARK_VISIT_REQUIRED":
        ensureOpen();
        if (!action.note.trim()) throw new Error("MESSAGE_REQUIRED");
        ticket.status = "VISIT_REQUIRED";
        ticket.messages.push(message(action.note));
        ticket.history.push(history("VISIT_REQUIRED"));
        break;
      case "SCHEDULE_VISIT": {
        ensureOpen();
        const scheduledAt = new Date(action.scheduledAt);
        if (Number.isNaN(scheduledAt.getTime()))
          throw new Error("INVALID_VISIT_DATE");
        if (action.technicianId) {
          requireRole(["SUPPORT", "ADMIN"]);
          const technician = state.users.find(
            (user) =>
              user.id === action.technicianId &&
              user.role === "TECHNICIAN" &&
              user.active
          );
          if (!technician) throw new Error("TECHNICIAN_NOT_FOUND");
          ticket.assigneeName = technician.fullName;
        }
        ticket.visitScheduledAt = scheduledAt.toISOString();
        ticket.status = "VISIT_SCHEDULED";
        ticket.messages.push(
          message(
            action.note?.trim() ||
              `Visita técnica agendada para ${scheduledAt.toLocaleString("pt-BR")}.`
          )
        );
        ticket.history.push(history("VISIT_SCHEDULED"));
        break;
      }
      case "RESOLVE":
        ensureOpen();
        if (!action.resolution.trim()) throw new Error("MESSAGE_REQUIRED");
        ticket.resolutionSummary = action.resolution.trim();
        ticket.status = "RESOLVED";
        ticket.messages.push(message(action.resolution));
        ticket.history.push(history("TICKET_RESOLVED"));
        break;
      case "REOPEN":
        requireRole(["SUPPORT", "ADMIN"]);
        if (ticket.status !== "RESOLVED") throw new Error("INVALID_TRANSITION");
        if (!action.reason.trim()) throw new Error("MESSAGE_REQUIRED");
        ticket.status = "IN_PROGRESS";
        ticket.resolutionSummary = undefined;
        ticket.messages.push(message(action.reason));
        ticket.history.push(history("TICKET_REOPENED"));
        break;
    }

    ticket.updatedAt = now;
    writeMockState(state);
    return JSON.parse(JSON.stringify(ticket)) as Ticket;
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
      status: "WAITING_SUPPORT",
      priority: "MEDIUM",
      branchName: "Suporte América do Sul",
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
        },
        {
          id: `${nextNumber}-routed`,
          action: "ROUTED_TO_BRANCH",
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
