"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { AuthService } from "@/services/auth-service";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("nav");
  const router = useRouter();
  async function signOut() {
    await new AuthService().signOut();
    router.push("/auth/login");
  }
  return (
    <Button
      aria-label={t("signOut")}
      onClick={() => void signOut()}
      size={compact ? "icon" : "sm"}
      variant="ghost"
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {!compact && t("signOut")}
    </Button>
  );
}
