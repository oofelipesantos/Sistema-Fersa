import type {
  AuthSession,
  Organization,
  Ticket,
  UserProfile
} from "@/types/domain";
import { mockTickets } from "./mock-data";

const stateKey = "fersa-mock-state-v2";
const sessionKey = "fersa-mock-session-v2";

export interface MockStoredUser extends UserProfile {
  password: string;
}

export interface MockState {
  organizations: Organization[];
  users: MockStoredUser[];
  tickets: Ticket[];
}

const now = "2026-08-25T10:00:00.000Z";

const seedOrganizations: Organization[] = [
  {
    id: "org-horizonte",
    name: "Oficina Horizonte",
    type: "WORKSHOP",
    taxDocument: "12.345.678/0001-95",
    country: "Brasil",
    verificationStatus: "VERIFIED",
    verificationRequestedAt: "2026-08-01T12:00:00.000Z",
    verifiedAt: "2026-08-02T14:30:00.000Z",
    verifiedBy: "Equipe Fersa",
    active: true,
    createdAt: "2026-08-01T12:00:00.000Z",
    updatedAt: "2026-08-02T14:30:00.000Z"
  },
  {
    id: "org-fersa",
    name: "Fersa Bearings",
    type: "DISTRIBUTOR",
    taxDocument: "FERSA-INTERNAL",
    country: "Espanha",
    verificationStatus: "VERIFIED",
    verificationRequestedAt: "2026-01-01T00:00:00.000Z",
    verifiedAt: "2026-01-01T00:00:00.000Z",
    verifiedBy: "Sistema",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "org-taller-norte",
    name: "Taller Norte",
    type: "DISTRIBUTOR",
    taxDocument: "MX-RFC-TNO220415AB1",
    country: "México",
    verificationStatus: "PENDING",
    verificationRequestedAt: "2026-08-23T11:00:00.000Z",
    active: true,
    createdAt: "2026-08-23T11:00:00.000Z",
    updatedAt: "2026-08-23T11:00:00.000Z"
  },
  {
    id: "org-northline",
    name: "Northline Service",
    type: "CUSTOMER",
    taxDocument: "US-EIN-84-3940127",
    country: "United States",
    verificationStatus: "BLOCKED",
    verificationRequestedAt: "2026-08-20T11:00:00.000Z",
    verifiedBy: "Equipe Fersa",
    active: false,
    createdAt: "2026-08-20T11:00:00.000Z",
    updatedAt: "2026-08-24T11:00:00.000Z"
  }
];

const seedUsers: MockStoredUser[] = [
  {
    id: "demo-user",
    fullName: "Mariana Costa",
    email: "demo@fersa.test",
    phone: "+55 41 99999-1200",
    password: "Demo123!",
    role: "MECHANIC",
    organizationId: "org-horizonte",
    preferredLocale: "pt-BR",
    active: true,
    createdAt: "2026-08-01T12:00:00.000Z"
  },
  {
    id: "admin-user",
    fullName: "Alex Martins",
    email: "admin@fersa.test",
    phone: "+34 600 555 010",
    password: "Admin123!",
    role: "ADMIN",
    organizationId: "org-fersa",
    preferredLocale: "pt-BR",
    active: true,
    createdAt: now
  },
  {
    id: "support-user",
    fullName: "Lucía Torres",
    email: "support@fersa.test",
    phone: "+34 600 555 011",
    password: "Support123!",
    role: "SUPPORT",
    organizationId: "org-fersa",
    preferredLocale: "es",
    active: true,
    createdAt: now
  },
  {
    id: "customer-mx",
    fullName: "Carlos Méndez",
    email: "carlos@tallernorte.test",
    phone: "+52 81 5555 0101",
    password: "Carlos123!",
    role: "DISTRIBUTOR",
    organizationId: "org-taller-norte",
    preferredLocale: "es",
    active: true,
    createdAt: "2026-08-23T11:00:00.000Z"
  },
  {
    id: "customer-us",
    fullName: "Taylor Reed",
    email: "taylor@northline.test",
    phone: "+1 312 555 0191",
    password: "Taylor123!",
    role: "CUSTOMER",
    organizationId: "org-northline",
    preferredLocale: "en",
    active: false,
    createdAt: "2026-08-20T11:00:00.000Z"
  }
];

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function cloneSeed(): MockState {
  return JSON.parse(
    JSON.stringify({
      organizations: seedOrganizations,
      users: seedUsers,
      tickets: mockTickets
    })
  ) as MockState;
}

export function readMockState(): MockState {
  const target = storage();
  if (!target) return cloneSeed();
  const stored = target.getItem(stateKey);
  if (stored) {
    try {
      return JSON.parse(stored) as MockState;
    } catch {
      target.removeItem(stateKey);
    }
  }
  const seeded = cloneSeed();
  target.setItem(stateKey, JSON.stringify(seeded));
  return seeded;
}

export function writeMockState(state: MockState) {
  const target = storage();
  if (target) target.setItem(stateKey, JSON.stringify(state));
}

export function readMockSession(): AuthSession | null {
  const target = storage();
  const userId = target?.getItem(sessionKey);
  if (!userId) return null;
  const state = readMockState();
  const user = state.users.find((candidate) => candidate.id === userId);
  if (!user || !user.active) return null;
  const { password: _password, ...profile } = user;
  void _password;
  return {
    user: profile,
    organization:
      state.organizations.find(
        (candidate) => candidate.id === user.organizationId
      ) ?? null
  };
}

export function writeMockSession(userId: string | null) {
  const target = storage();
  if (!target) return;
  if (userId) target.setItem(sessionKey, userId);
  else target.removeItem(sessionKey);
}

export function resetMockStore() {
  const target = storage();
  target?.removeItem(stateKey);
  target?.removeItem(sessionKey);
}
