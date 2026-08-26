"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { UserRole } from "@/types/domain";
import { useAuth } from "./auth-context";

export function ProtectedRoute({
  children,
  roles
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");
  const allowed = Boolean(
    session && (!roles || roles.includes(session.user.role))
  );

  useEffect(() => {
    if (loading) return;
    if (!session)
      router.replace(`/auth/login?returnTo=${encodeURIComponent(pathname)}`);
    else if (!allowed) router.replace("/");
  }, [allowed, loading, pathname, router, session]);

  if (!allowed)
    return (
      <div
        className="flex min-h-48 items-center justify-center gap-3 text-base text-slate-700"
        role="status"
      >
        <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
        {t("checkingAccess")}
      </div>
    );
  return children;
}
