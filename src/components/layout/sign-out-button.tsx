"use client";

import { LogIn, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-context";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth-service";

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("nav");
  const authT = useTranslations("auth");
  const { session, loading } = useAuth();
  const router = useRouter();
  async function signOut() {
    await new AuthService().signOut();
    router.push("/auth/login");
  }
  if (!loading && !session)
    return (
      <Link
        aria-label={authT("signIn")}
        className={cn(
          buttonVariants({ size: compact ? "icon" : "sm", variant: "outline" })
        )}
        href="/auth/login"
      >
        <LogIn className="h-5 w-5" aria-hidden />
        {!compact && authT("signIn")}
      </Link>
    );
  return (
    <Button
      aria-label={t("signOut")}
      disabled={loading}
      onClick={() => void signOut()}
      size={compact ? "icon" : "sm"}
      variant="ghost"
    >
      <LogOut className="h-5 w-5" aria-hidden />
      {!compact && t("signOut")}
    </Button>
  );
}
