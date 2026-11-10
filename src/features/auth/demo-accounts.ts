import type { UserRole } from "@/types/domain";

/** Credentials that exist only in the browser-side mock mode. */
export const demoAccounts = [
  {
    key: "demoCustomer",
    role: "CUSTOMER",
    email: "demo@fersa.test",
    password: "Demo123!",
    destination: "/"
  },
  {
    key: "demoSupport",
    role: "SUPPORT",
    email: "support@fersa.test",
    password: "Support123!",
    destination: "/service"
  },
  {
    key: "demoTechnician",
    role: "TECHNICIAN",
    email: "rafael@fersa.test",
    password: "Tech123!",
    destination: "/service/my-work"
  },
  {
    key: "demoAdmin",
    role: "ADMIN",
    email: "admin@fersa.test",
    password: "Admin123!",
    destination: "/service/reports"
  }
] as const satisfies ReadonlyArray<{
  key: string;
  role: UserRole;
  email: string;
  password: string;
  destination: string;
}>;

export type DemoAccount = (typeof demoAccounts)[number];
