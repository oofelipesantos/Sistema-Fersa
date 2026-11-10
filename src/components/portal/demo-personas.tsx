"use client";

import {
  ArrowRight,
  Headset,
  LoaderCircle,
  ShieldCheck,
  Truck,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { demoAccounts, type DemoAccount } from "@/features/auth/demo-accounts";
import { useRouter } from "@/i18n/navigation";
import { cn, isMockMode } from "@/lib/utils";
import { AuthService } from "@/services/auth-service";

const icons = {
  demoCustomer: Truck,
  demoSupport: Headset,
  demoTechnician: Wrench,
  demoAdmin: ShieldCheck
} as const;

/**
 * One-click entry into each demo profile. Signs in with the mock credentials
 * and opens the most representative screen for that profile.
 */
export function DemoPersonas({
  variant = "light",
  columns = 2,
  className
}: {
  variant?: "light" | "dark";
  columns?: 1 | 2;
  className?: string;
}) {
  const t = useTranslations("personas");
  const router = useRouter();
  const [pending, setPending] = useState<string>();
  const [failed, setFailed] = useState(false);
  if (!isMockMode()) return null;

  async function enter(account: DemoAccount) {
    setPending(account.key);
    setFailed(false);
    try {
      await new AuthService().signIn(account.email, account.password);
      router.push(account.destination);
    } catch {
      setFailed(true);
      setPending(undefined);
    }
  }

  const dark = variant === "dark";
  return (
    <div className={className}>
      <div className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2")}>
        {demoAccounts.map((account) => {
          const Icon = icons[account.key];
          const busy = pending === account.key;
          return (
            <button
              className={cn(
                "group flex min-h-24 items-start gap-3 rounded-xl border p-4 text-left transition disabled:opacity-60",
                dark
                  ? "border-white/15 bg-white/5 text-white hover:border-accent-400 hover:bg-white/10"
                  : "bg-white shadow-card hover:border-navy-600"
              )}
              disabled={Boolean(pending)}
              key={account.key}
              onClick={() => void enter(account)}
              type="button"
            >
              <span
                className={cn(
                  "rounded-lg p-2",
                  dark
                    ? "bg-accent-500/20 text-accent-400"
                    : "bg-navy-50 text-navy-700"
                )}
              >
                {busy ? (
                  <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden />
                ) : (
                  <Icon className="h-5 w-5" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">
                  {t(`${account.key}.title`)}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-sm leading-5",
                    dark ? "text-blue-100/80" : "text-slate-600"
                  )}
                >
                  {t(`${account.key}.description`)}
                </span>
              </span>
              <ArrowRight
                className={cn(
                  "mt-1 h-4 w-4 shrink-0 transition group-hover:translate-x-0.5",
                  dark ? "text-accent-400" : "text-navy-700"
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      {failed && (
        <p className="mt-3 text-sm font-semibold text-red-600" role="alert">
          {t("failed")}
        </p>
      )}
    </div>
  );
}
