import { createSupabaseClient } from "@/lib/supabase";
import type { OrganizationRepository } from "@/repositories/contracts";
import type {
  Locale,
  OrganizationType,
  OrganizationWithUsers,
  UserRole,
  VerificationStatus
} from "@/types/domain";

type OrganizationRow = {
  id: string;
  name: string;
  type: OrganizationType;
  tax_document: string | null;
  country: string | null;
  verification_status: VerificationStatus;
  verification_requested_at: string;
  verified_at: string | null;
  verified_by: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    role: UserRole;
    preferred_locale: Locale;
    active: boolean;
    created_at: string;
  }[];
  tickets: { count: number }[];
};

export class SupabaseOrganizationRepository implements OrganizationRepository {
  private readonly client = createSupabaseClient();

  async listWithUsers(): Promise<OrganizationWithUsers[]> {
    const { data, error } = await this.client
      .from("organizations")
      .select(
        "id, name, type, tax_document, country, verification_status, verification_requested_at, verified_at, verified_by, active, created_at, updated_at, profiles(id, full_name, email, phone, role, preferred_locale, active, created_at), tickets(count)"
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as OrganizationRow[]).map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      taxDocument: row.tax_document ?? "",
      country: row.country ?? "",
      verificationStatus: row.verification_status,
      verificationRequestedAt: row.verification_requested_at,
      verifiedAt: row.verified_at ?? undefined,
      verifiedBy: row.verified_by ?? undefined,
      active: row.active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      users: row.profiles.map((profile) => ({
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone ?? "",
        role: profile.role,
        organizationId: row.id,
        preferredLocale: profile.preferred_locale,
        active: profile.active,
        createdAt: profile.created_at
      })),
      ticketCount: row.tickets[0]?.count ?? 0
    }));
  }

  async updateVerification(organizationId: string, status: VerificationStatus) {
    const { error } = await this.client.rpc("review_organization", {
      target_organization_id: organizationId,
      next_status: status
    });
    if (error) throw error;
  }
}
