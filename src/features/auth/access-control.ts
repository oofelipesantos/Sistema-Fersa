import type { AuthSession, UserRole } from "@/types/domain";

const internalRoles: UserRole[] = ["SUPPORT", "TECHNICIAN", "ADMIN"];
const organizationManagementRoles: UserRole[] = ["SUPPORT", "ADMIN"];

export function isInternalRole(role?: UserRole) {
  return Boolean(role && internalRoles.includes(role));
}

export function canManageOrganizations(role?: UserRole) {
  return Boolean(role && organizationManagementRoles.includes(role));
}

export function canAccessTicket(
  session: AuthSession | null,
  customerId: string,
  assigneeName?: string
) {
  if (!session) return false;
  if (session.user.role === "ADMIN" || session.user.role === "SUPPORT")
    return true;
  if (session.user.role === "TECHNICIAN")
    return Boolean(assigneeName && assigneeName === session.user.fullName);
  return session.user.id === customerId;
}

export function getSafeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const parsed = new URL(value, "https://local.invalid");
    if (parsed.origin !== "https://local.invalid") return "/";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}
