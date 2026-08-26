import { getTicketRepository } from "@/repositories/repository-factory";
import type { CreateTicketInput } from "@/types/domain";
import { RoutingService } from "./routing-service";

export class TicketService {
  constructor(private readonly routingService = new RoutingService()) {}
  async create(input: CreateTicketInput) {
    const routing = await this.routingService.route({
      country: input.country ?? "",
      state: input.state,
      city: input.city,
      latitude: input.latitude,
      longitude: input.longitude,
      productId: input.productId,
      issueCategoryId: input.categoryId,
      locale: input.locale
    });
    const ticket = await getTicketRepository().create(input);
    return { ticket, routing };
  }
}
