import { createSupabaseClient } from "@/lib/supabase";
import { isMockMode } from "@/lib/utils";

export class AuthService {
  async signIn(email: string, password: string) {
    if (isMockMode()) return { user: { id: "demo-user", email } };
    const { data, error } =
      await createSupabaseClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }
  async resetPassword(email: string) {
    if (isMockMode()) return;
    const redirectTo = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
      : undefined;
    const { error } = await createSupabaseClient().auth.resetPasswordForEmail(
      email,
      { redirectTo }
    );
    if (error) throw error;
  }
  async signOut() {
    if (!isMockMode()) await createSupabaseClient().auth.signOut();
  }
}
