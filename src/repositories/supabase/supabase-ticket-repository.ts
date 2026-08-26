import type { TicketRepository } from "@/repositories/contracts";
import { createSupabaseClient } from "@/lib/supabase";
import type {
  CreateTicketInput,
  DashboardMetrics,
  Locale,
  Ticket,
  TicketPriority,
  TicketStatus
} from "@/types/domain";

type TranslationRow = { locale: Locale; name: string };
type ProfileRow = { full_name: string } | null;
type TicketRow = {
  id: string;
  number: number;
  product_id: string;
  status: TicketStatus;
  priority: TicketPriority;
  locale: Locale;
  customer_language: Locale;
  description: string;
  equipment: string | null;
  serial_number: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  products: { part_number: string } | null;
  customer: (ProfileRow & { role: Ticket["role"] }) | null;
  assignee: ProfileRow;
  branch: { name: string } | null;
  organization: { name: string } | null;
  issue_categories: { issue_category_translations: TranslationRow[] } | null;
  ticket_messages: {
    id: string;
    body: string;
    visibility: "CUSTOMER" | "INTERNAL";
    created_at: string;
    author: ProfileRow;
  }[];
  ticket_history: { id: string; action: string; created_at: string }[];
};

const ticketSelect = `
  id, number, product_id, status, priority, locale, customer_language, description, equipment, serial_number, country, state, city, address, created_at, updated_at,
  products(part_number),
  customer:profiles!tickets_customer_id_fkey(full_name, role),
  assignee:profiles!tickets_assigned_to_fkey(full_name),
  branch:branches(name),
  organization:organizations(name),
  issue_categories(issue_category_translations(locale, name)),
  ticket_messages(id, body, visibility, created_at, author:profiles!ticket_messages_author_id_fkey(full_name)),
  ticket_history(id, action, created_at)
`;
const supportedLocales: Locale[] = ["pt-BR", "es", "en"];

export class SupabaseTicketRepository implements TicketRepository {
  private readonly client = createSupabaseClient();

  async list(): Promise<Ticket[]> {
    const { data, error } = await this.client
      .from("tickets")
      .select(ticketSelect)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as TicketRow[]).map((row) => this.map(row));
  }

  async findById(id: string): Promise<Ticket | null> {
    const { data, error } = await this.client
      .from("tickets")
      .select(ticketSelect)
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? this.map(data as unknown as TicketRow) : null;
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const tickets = await this.list();
    const today = new Date().toDateString();
    const count = (status: TicketStatus) =>
      tickets.filter((ticket) => ticket.status === status).length;
    const byLocale = (locale: Locale) =>
      tickets.filter((ticket) => ticket.locale === locale).length;
    const total = tickets.length || 1;
    const resolutionTimes = tickets
      .filter((ticket) => ticket.status === "RESOLVED")
      .map(
        (ticket) =>
          (new Date(ticket.updatedAt).getTime() -
            new Date(ticket.createdAt).getTime()) /
          3_600_000
      );
    return {
      newTickets: count("NEW"),
      inProgress: count("IN_PROGRESS"),
      waitingCustomer: count("WAITING_CUSTOMER"),
      waitingTechnician: count("WAITING_TECHNICIAN"),
      resolvedToday: tickets.filter(
        (ticket) =>
          ticket.status === "RESOLVED" &&
          new Date(ticket.updatedAt).toDateString() === today
      ).length,
      resolvedMonth: count("RESOLVED"),
      averageResponseHours: resolutionTimes.length
        ? Number(
            (
              resolutionTimes.reduce((sum, value) => sum + value, 0) /
              resolutionTimes.length
            ).toFixed(1)
          )
        : 0,
      selfServiceRate: 0,
      languages: supportedLocales.map((locale) => ({
        locale,
        percentage: Math.round((byLocale(locale) / total) * 100)
      }))
    };
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const {
      data: { user },
      error: userError
    } = await this.client.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("AUTHENTICATION_REQUIRED");
    const { data, error } = await this.client
      .from("tickets")
      .insert({
        product_id: input.productId,
        issue_category_id: input.categoryId,
        description: input.description,
        equipment: input.equipment,
        serial_number: input.serialNumber,
        lot: input.lot,
        estimated_hours: input.hours,
        quantity: input.quantity,
        country: input.country,
        state: input.state,
        city: input.city,
        latitude: input.latitude,
        longitude: input.longitude,
        locale: input.locale,
        customer_language: input.locale,
        customer_id: user.id
      })
      .select("id")
      .single();
    if (error) throw error;
    const ticket = await this.findById(data.id);
    if (!ticket) throw new Error("TICKET_NOT_FOUND_AFTER_CREATE");
    return ticket;
  }

  private map(row: TicketRow): Ticket {
    const translations = Object.fromEntries(
      (row.issue_categories?.issue_category_translations ?? []).map(
        (translation) => [translation.locale, translation.name]
      )
    ) as Partial<Record<Locale, string>>;
    const fallback =
      translations.en ?? translations["pt-BR"] ?? translations.es ?? "";
    return {
      id: row.id,
      number: row.number,
      customerName: row.customer?.full_name ?? "",
      organizationName: row.organization?.name ?? "",
      role: row.customer?.role ?? "DISTRIBUTOR",
      country: row.country ?? "",
      locale: row.locale,
      productId: row.product_id,
      productPartNumber: row.products?.part_number ?? "",
      issueTitle: {
        "pt-BR": translations["pt-BR"] ?? fallback,
        es: translations.es ?? fallback,
        en: translations.en ?? fallback
      },
      description: row.description,
      status: row.status,
      priority: row.priority,
      branchName: row.branch?.name ?? "",
      assigneeName: row.assignee?.full_name ?? undefined,
      updatedAt: row.updated_at,
      createdAt: row.created_at,
      equipment: row.equipment ?? undefined,
      serialNumber: row.serial_number ?? undefined,
      location:
        ([row.city, row.state, row.country].filter(Boolean).join(", ") ||
          row.address) ??
        undefined,
      messages: row.ticket_messages
        .filter((message) => message.visibility === "CUSTOMER")
        .map((message) => ({
          id: message.id,
          authorName: message.author?.full_name ?? "",
          body: message.body,
          visibility: message.visibility,
          createdAt: message.created_at
        })),
      history: row.ticket_history.map((item) => ({
        id: item.id,
        action: item.action,
        createdAt: item.created_at
      }))
    };
  }
}
