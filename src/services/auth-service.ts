import type { User } from "@supabase/supabase-js";
import type { RegistrationValues } from "@/features/auth/auth-schema";
import { createSupabaseClient } from "@/lib/supabase";
import { isMockMode } from "@/lib/utils";
import {
  readMockSession,
  readMockState,
  writeMockSession,
  writeMockState
} from "@/repositories/mock/mock-store";
import type {
  AuthSession,
  Locale,
  Organization,
  OrganizationType,
  UserProfile,
  UserRole,
  VerificationStatus
} from "@/types/domain";

export const authChangedEvent = "fersa-auth-changed";

type ProfileRow = {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  organization_id: string | null;
  preferred_locale: Locale;
  active: boolean;
  created_at: string;
  organizations: {
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
  } | null;
};

function emitAuthChanged() {
  if (typeof window !== "undefined")
    window.dispatchEvent(new Event(authChangedEvent));
}

function createId(prefix: string) {
  const value =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return `${prefix}-${value}`;
}

function roleForOrganization(
  type: RegistrationValues["organizationType"]
): UserRole {
  if (type === "DISTRIBUTOR") return "DISTRIBUTOR";
  if (type === "WORKSHOP") return "MECHANIC";
  return "CUSTOMER";
}

export class AuthService {
  async signIn(email: string, password: string): Promise<AuthSession> {
    if (isMockMode()) {
      const state = readMockState();
      const user = state.users.find(
        (candidate) =>
          candidate.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (!user || user.password !== password)
        throw new Error("INVALID_CREDENTIALS");
      const organization = state.organizations.find(
        (candidate) => candidate.id === user.organizationId
      );
      if (
        !user.active ||
        !organization?.active ||
        organization.verificationStatus === "BLOCKED"
      )
        throw new Error("ACCOUNT_BLOCKED");
      writeMockSession(user.id);
      emitAuthChanged();
      const session = readMockSession();
      if (!session) throw new Error("SESSION_NOT_CREATED");
      return session;
    }

    const client = createSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error) throw new Error("INVALID_CREDENTIALS");
    const session = await this.getSupabaseSession(data.user);
    if (!session) throw new Error("PROFILE_NOT_FOUND");
    if (
      !session.user.active ||
      !session.organization?.active ||
      session.organization.verificationStatus === "BLOCKED"
    ) {
      await client.auth.signOut();
      throw new Error("ACCOUNT_BLOCKED");
    }
    return session;
  }

  async signUp(values: RegistrationValues, locale: Locale) {
    if (isMockMode()) {
      const state = readMockState();
      const normalizedEmail = values.email.trim().toLowerCase();
      if (
        state.users.some(
          (candidate) => candidate.email.toLowerCase() === normalizedEmail
        )
      )
        throw new Error("EMAIL_ALREADY_REGISTERED");
      const now = new Date().toISOString();
      const organizationId = createId("org");
      const userId = createId("user");
      state.organizations.push({
        id: organizationId,
        name: values.organizationName.trim(),
        type: values.organizationType,
        taxDocument: values.taxDocument.trim(),
        country: values.country.trim(),
        verificationStatus: "PENDING",
        verificationRequestedAt: now,
        active: true,
        createdAt: now,
        updatedAt: now
      });
      state.users.push({
        id: userId,
        fullName: values.fullName.trim(),
        email: normalizedEmail,
        phone: values.phone.trim(),
        password: values.password,
        role: roleForOrganization(values.organizationType),
        organizationId,
        preferredLocale: locale,
        active: true,
        createdAt: now
      });
      writeMockState(state);
      writeMockSession(userId);
      emitAuthChanged();
      return { needsEmailConfirmation: false };
    }

    const { data, error } = await createSupabaseClient().auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: {
          full_name: values.fullName.trim(),
          phone: values.phone.trim(),
          organization_name: values.organizationName.trim(),
          organization_type: values.organizationType,
          tax_document: values.taxDocument.trim(),
          country: values.country.trim(),
          preferred_locale: locale,
          accepted_terms_at: new Date().toISOString()
        }
      }
    });
    if (error) {
      if (error.message.toLowerCase().includes("already"))
        throw new Error("EMAIL_ALREADY_REGISTERED");
      throw error;
    }
    return { needsEmailConfirmation: !data.session };
  }

  async getSession(): Promise<AuthSession | null> {
    if (isMockMode()) return readMockSession();
    const client = createSupabaseClient();
    const {
      data: { session },
      error
    } = await client.auth.getSession();
    if (error || !session?.user) return null;
    const result = await this.getSupabaseSession(session.user);
    if (
      !result?.user.active ||
      !result.organization?.active ||
      result.organization.verificationStatus === "BLOCKED"
    )
      return null;
    return result;
  }

  async resetPassword(email: string, locale: Locale) {
    if (isMockMode()) return;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    const redirectTo = appUrl
      ? `${appUrl}/${locale}/auth/update-password`
      : undefined;
    const { error } = await createSupabaseClient().auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    );
    if (error) throw error;
  }

  async signOut() {
    if (isMockMode()) writeMockSession(null);
    else await createSupabaseClient().auth.signOut();
    emitAuthChanged();
  }

  async updatePassword(password: string) {
    if (isMockMode()) return;
    const { error } = await createSupabaseClient().auth.updateUser({
      password
    });
    if (error) throw error;
  }

  subscribe(callback: () => void) {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener(authChangedEvent, callback);
    if (isMockMode())
      return () => window.removeEventListener(authChangedEvent, callback);
    const { data } = createSupabaseClient().auth.onAuthStateChange(() =>
      callback()
    );
    return () => {
      window.removeEventListener(authChangedEvent, callback);
      void data.subscription.unsubscribe();
    };
  }

  private async getSupabaseSession(user: User): Promise<AuthSession | null> {
    const { data, error } = await createSupabaseClient()
      .from("profiles")
      .select(
        "id, full_name, phone, role, organization_id, preferred_locale, active, created_at, organizations(id, name, type, tax_document, country, verification_status, verification_requested_at, verified_at, verified_by, active, created_at, updated_at)"
      )
      .eq("id", user.id)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as unknown as ProfileRow;
    const profile: UserProfile = {
      id: row.id,
      fullName: row.full_name,
      email: user.email ?? "",
      phone: row.phone ?? "",
      role: row.role,
      organizationId: row.organization_id ?? "",
      preferredLocale: row.preferred_locale,
      active: row.active,
      createdAt: row.created_at
    };
    const organization: Organization | null = row.organizations
      ? {
          id: row.organizations.id,
          name: row.organizations.name,
          type: row.organizations.type,
          taxDocument: row.organizations.tax_document ?? "",
          country: row.organizations.country ?? "",
          verificationStatus: row.organizations.verification_status,
          verificationRequestedAt: row.organizations.verification_requested_at,
          verifiedAt: row.organizations.verified_at ?? undefined,
          verifiedBy: row.organizations.verified_by ?? undefined,
          active: row.organizations.active,
          createdAt: row.organizations.created_at,
          updatedAt: row.organizations.updated_at
        }
      : null;
    return { user: profile, organization };
  }
}
