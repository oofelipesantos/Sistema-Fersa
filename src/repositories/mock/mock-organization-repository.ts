import { canManageOrganizations } from "@/features/auth/access-control";
import type { OrganizationRepository } from "@/repositories/contracts";
import type { VerificationStatus } from "@/types/domain";
import { readMockSession, readMockState, writeMockState } from "./mock-store";

export class MockOrganizationRepository implements OrganizationRepository {
  async listWithUsers() {
    const session = readMockSession();
    if (!canManageOrganizations(session?.user.role))
      throw new Error("ACCESS_DENIED");
    const state = readMockState();
    return state.organizations
      .map((organization) => ({
        ...organization,
        users: state.users
          .filter((user) => user.organizationId === organization.id)
          .map(({ password: _password, ...user }) => {
            void _password;
            return user;
          }),
        ticketCount: state.tickets.filter(
          (ticket) => ticket.organizationId === organization.id
        ).length
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async updateVerification(organizationId: string, status: VerificationStatus) {
    const session = readMockSession();
    if (!canManageOrganizations(session?.user.role))
      throw new Error("ACCESS_DENIED");
    const state = readMockState();
    const organization = state.organizations.find(
      (candidate) => candidate.id === organizationId
    );
    if (!organization) throw new Error("ORGANIZATION_NOT_FOUND");
    const hasInternalUsers = state.users.some(
      (user) =>
        user.organizationId === organizationId &&
        ["ADMIN", "SUPPORT", "TECHNICIAN"].includes(user.role)
    );
    if (hasInternalUsers) throw new Error("PROTECTED_INTERNAL_ORGANIZATION");
    const now = new Date().toISOString();
    organization.verificationStatus = status;
    organization.active = status !== "BLOCKED";
    organization.updatedAt = now;
    organization.verifiedAt = status === "VERIFIED" ? now : undefined;
    organization.verifiedBy = session?.user.fullName;
    for (const user of state.users.filter(
      (candidate) => candidate.organizationId === organizationId
    ))
      user.active = status !== "BLOCKED";
    writeMockState(state);
  }
}
