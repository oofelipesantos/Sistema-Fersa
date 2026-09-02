import { beforeEach, describe, expect, it } from "vitest";
import { AuthService } from "@/services/auth-service";
import { MockOrganizationRepository } from "./mock-organization-repository";
import { resetMockStore } from "./mock-store";
import { MockTicketRepository } from "./mock-ticket-repository";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const browser = {
  localStorage: new MemoryStorage(),
  dispatchEvent: () => true
};

Object.defineProperty(globalThis, "window", {
  configurable: true,
  value: browser
});

describe("mock authentication and repositories", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_USE_MOCK_DATA = "true";
    resetMockStore();
  });

  it("does not accept arbitrary credentials or unknown accounts", async () => {
    const auth = new AuthService();
    await expect(auth.signIn("unknown@fersa.test", "anything")).rejects.toThrow(
      "INVALID_CREDENTIALS"
    );
    await expect(auth.signIn("demo@fersa.test", "wrong")).rejects.toThrow(
      "INVALID_CREDENTIALS"
    );
  });

  it("persists a valid session and isolates tickets by customer", async () => {
    const auth = new AuthService();
    const repository = new MockTicketRepository();
    await auth.signIn("demo@fersa.test", "Demo123!");
    expect((await auth.getSession())?.user.fullName).toBe("Mariana Costa");
    expect(
      (await repository.list()).map((ticket) => ticket.customerId)
    ).toEqual(["demo-user"]);

    await auth.signOut();
    await auth.signIn("carlos@tallernorte.test", "Carlos123!");
    expect(await repository.findById("ticket-132")).toBeNull();
  });

  it("persists a newly created ticket across repository instances", async () => {
    const auth = new AuthService();
    await auth.signIn("demo@fersa.test", "Demo123!");
    const created = await new MockTicketRepository().create({
      productId: "product-f400009",
      categoryId: "noise",
      description: "Ruído contínuo depois da instalação do rolamento.",
      quantity: 1,
      country: "Brasil",
      locale: "pt-BR"
    });
    const restored = await new MockTicketRepository().findById(created.id);
    expect(restored?.customerId).toBe("demo-user");
    expect(restored?.organizationId).toBe("org-horizonte");
  });

  it("lets pending registrations open tickets", async () => {
    const auth = new AuthService();
    await auth.signUp(
      {
        fullName: "João Teste",
        email: "joao@example.com",
        phone: "+55 11 99999-2222",
        password: "Fersa123!",
        confirmPassword: "Fersa123!",
        organizationName: "Oficina Teste",
        organizationType: "WORKSHOP",
        taxDocument: "11.222.333/0001-81",
        country: "Brasil",
        acceptedTerms: true
      },
      "pt-BR"
    );
    const session = await auth.getSession();
    expect(session?.organization?.verificationStatus).toBe("PENDING");
    await expect(
      new MockTicketRepository().create({
        productId: "product-f400009",
        categoryId: "vibration",
        description: "Vibração percebida durante o teste de rodagem.",
        locale: "pt-BR",
        country: "Brasil"
      })
    ).resolves.toMatchObject({ customerName: "João Teste" });
  });

  it("persists company review actions for internal users", async () => {
    const auth = new AuthService();
    await auth.signIn("admin@fersa.test", "Admin123!");
    const repository = new MockOrganizationRepository();
    await repository.updateVerification("org-taller-norte", "VERIFIED");
    const company = (await repository.listWithUsers()).find(
      (organization) => organization.id === "org-taller-norte"
    );
    expect(company?.verificationStatus).toBe("VERIFIED");
  });

  it("does not let an administrator block an internal organization", async () => {
    const auth = new AuthService();
    await auth.signIn("admin@fersa.test", "Admin123!");
    await expect(
      new MockOrganizationRepository().updateVerification(
        "org-fersa",
        "BLOCKED"
      )
    ).rejects.toThrow("PROTECTED_INTERNAL_ORGANIZATION");
  });

  it("persists support escalation, technician access and resolution", async () => {
    const auth = new AuthService();
    const repository = new MockTicketRepository();
    await auth.signIn("support@fersa.test", "Support123!");
    await repository.applyWorkflow("ticket-145", {
      type: "ASSIGN_TECHNICIAN",
      technicianId: "technician-rafael",
      note: "Encaminhado para análise de montagem e sinal do ABS."
    });
    await auth.signOut();

    await auth.signIn("rafael@fersa.test", "Tech123!");
    const assigned = await repository.findById("ticket-145");
    expect(assigned).toMatchObject({
      status: "TECHNICIAN_ASSIGNED",
      assigneeName: "Rafael Mendes"
    });
    const resolved = await repository.applyWorkflow("ticket-145", {
      type: "RESOLVE",
      resolution:
        "Conector do sensor ABS reposicionado e torque conferido. Teste aprovado."
    });
    expect(resolved.status).toBe("RESOLVED");
    expect(resolved.resolutionSummary).toContain("sensor ABS");
    expect(resolved.history.at(-1)?.action).toBe("TICKET_RESOLVED");
  });

  it("lists technician capacity from the current queue", async () => {
    const auth = new AuthService();
    await auth.signIn("admin@fersa.test", "Admin123!");
    const technicians = await new MockTicketRepository().listTechnicians();
    expect(technicians).toHaveLength(3);
    expect(
      technicians.find((item) => item.fullName === "Rafael Mendes")
    ).toMatchObject({ activeTicketCount: 1, resolvedTicketCount: 1 });
  });
});
