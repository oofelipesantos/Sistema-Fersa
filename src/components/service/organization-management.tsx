"use client";

import { Building2, ChevronDown, Search, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getOrganizationRepository } from "@/repositories/repository-factory";
import type {
  Locale,
  OrganizationWithUsers,
  VerificationStatus
} from "@/types/domain";

export function OrganizationManagement() {
  const t = useTranslations("organizations");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const [organizations, setOrganizations] = useState<OrganizationWithUsers[]>();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<VerificationStatus | "ALL">("ALL");
  const [type, setType] = useState<OrganizationWithUsers["type"] | "ALL">(
    "ALL"
  );
  const [busy, setBusy] = useState<string>();
  const [error, setError] = useState(false);

  async function load() {
    try {
      setOrganizations(await getOrganizationRepository().listWithUsers());
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    let active = true;
    getOrganizationRepository()
      .listWithUsers()
      .then((result) => {
        if (active) setOrganizations(result);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (organizations ?? []).filter((organization) => {
      const matchesQuery = [
        organization.name,
        organization.country,
        organization.taxDocument,
        ...organization.users.flatMap((user) => [
          user.fullName,
          user.email,
          user.phone
        ])
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      return (
        matchesQuery &&
        (status === "ALL" || organization.verificationStatus === status) &&
        (type === "ALL" || organization.type === type)
      );
    });
  }, [organizations, query, status, type]);

  async function update(
    organizationId: string,
    nextStatus: VerificationStatus
  ) {
    setBusy(organizationId);
    try {
      await getOrganizationRepository().updateVerification(
        organizationId,
        nextStatus
      );
      await load();
    } catch {
      setError(true);
    } finally {
      setBusy(undefined);
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600">
          {t("subtitle")}
        </p>
      </div>
      <Card className="mt-6">
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_220px_220px]">
          <label
            className="text-base font-semibold"
            htmlFor="organization-search"
          >
            {t("searchLabel")}
            <span className="relative mt-1.5 block">
              <Search
                className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-500"
                aria-hidden
              />
              <Input
                className="pl-10"
                id="organization-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                value={query}
              />
            </span>
          </label>
          <label
            className="text-base font-semibold"
            htmlFor="organization-status"
          >
            {t("statusFilter")}
            <Select
              className="mt-1.5"
              id="organization-status"
              onChange={(event) =>
                setStatus(event.target.value as VerificationStatus | "ALL")
              }
              value={status}
            >
              <option value="ALL">{common("all")}</option>
              <option value="PENDING">{t("status_PENDING")}</option>
              <option value="VERIFIED">{t("status_VERIFIED")}</option>
              <option value="BLOCKED">{t("status_BLOCKED")}</option>
            </Select>
          </label>
          <label
            className="text-base font-semibold"
            htmlFor="organization-type"
          >
            {t("typeFilter")}
            <Select
              className="mt-1.5"
              id="organization-type"
              onChange={(event) =>
                setType(
                  event.target.value as OrganizationWithUsers["type"] | "ALL"
                )
              }
              value={type}
            >
              <option value="ALL">{common("all")}</option>
              <option value="DISTRIBUTOR">{t("type_DISTRIBUTOR")}</option>
              <option value="WORKSHOP">{t("type_WORKSHOP")}</option>
              <option value="CUSTOMER">{t("type_CUSTOMER")}</option>
            </Select>
          </label>
        </CardContent>
      </Card>

      {error && (
        <p
          className="mt-5 rounded-lg border border-red-300 bg-red-50 p-4 font-semibold text-red-800"
          role="alert"
        >
          {t("loadError")}
        </p>
      )}

      {!organizations ? (
        <p className="p-8 text-center" role="status">
          {common("loading")}
        </p>
      ) : results.length === 0 ? (
        <Card className="mt-5">
          <CardContent className="p-8 text-center text-slate-600">
            {t("empty")}
          </CardContent>
        </Card>
      ) : (
        <div className="mt-5 space-y-4">
          {results.map((organization) => (
            <details
              className="group rounded-xl border bg-white shadow-card"
              key={organization.id}
            >
              <summary className="flex min-h-16 cursor-pointer list-none flex-wrap items-center gap-4 p-5 focus-visible:ring-4 focus-visible:ring-navy-600">
                <span className="text-navy-800 rounded-lg bg-navy-50 p-2">
                  <Building2 className="h-6 w-6" aria-hidden />
                </span>
                <span className="min-w-48 flex-1">
                  <span className="block text-lg font-bold">
                    {organization.name}
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    {t(`type_${organization.type}`)} · {organization.country}
                  </span>
                </span>
                <Status status={organization.verificationStatus} />
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <UsersRound className="h-5 w-5" aria-hidden />
                  {t("userCount", { count: organization.users.length })}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {t("ticketCount", { count: organization.ticketCount })}
                </span>
                <ChevronDown
                  className="h-5 w-5 transition group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t p-5">
                <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Detail
                    label={t("taxDocument")}
                    value={organization.taxDocument}
                  />
                  <Detail label={t("country")} value={organization.country} />
                  <Detail
                    label={t("registeredAt")}
                    value={formatDate(organization.createdAt, locale)}
                  />
                  <Detail
                    label={t("reviewedAt")}
                    value={
                      organization.verifiedAt
                        ? formatDate(organization.verifiedAt, locale)
                        : common("notAvailable")
                    }
                  />
                </dl>
                <h2 className="mt-6 text-lg font-bold">{t("linkedUsers")}</h2>
                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  {organization.users.map((user) => (
                    <article
                      className="rounded-lg border bg-steel-50 p-4"
                      key={user.id}
                    >
                      <h3 className="font-bold">{user.fullName}</h3>
                      <p className="mt-1 break-all text-sm text-slate-700">
                        {user.email}
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        {user.phone}
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {t(`role_${user.role}`)}
                      </p>
                    </article>
                  ))}
                </div>
                {isInternalOrganization(organization) ? (
                  <p className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900">
                    {t("internalProtected")}
                  </p>
                ) : (
                  <div
                    className="mt-6 flex flex-wrap gap-3"
                    aria-label={t("actionsLabel", {
                      name: organization.name
                    })}
                  >
                    <Button
                      disabled={
                        busy === organization.id ||
                        organization.verificationStatus === "VERIFIED"
                      }
                      onClick={() => void update(organization.id, "VERIFIED")}
                    >
                      {t("approve")}
                    </Button>
                    <Button
                      disabled={
                        busy === organization.id ||
                        organization.verificationStatus === "PENDING"
                      }
                      onClick={() => void update(organization.id, "PENDING")}
                      variant="outline"
                    >
                      {t("markPending")}
                    </Button>
                    <Button
                      disabled={
                        busy === organization.id ||
                        organization.verificationStatus === "BLOCKED"
                      }
                      onClick={() => void update(organization.id, "BLOCKED")}
                      variant="danger"
                    >
                      {t("block")}
                    </Button>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

function Status({ status }: { status: VerificationStatus }) {
  const t = useTranslations("organizations");
  const styles = {
    PENDING: "border-amber-300 bg-amber-50 text-amber-900",
    VERIFIED: "border-emerald-300 bg-emerald-50 text-emerald-900",
    BLOCKED: "border-red-300 bg-red-50 text-red-900"
  };
  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-bold ${styles[status]}`}
    >
      {t(`status_${status}`)}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-800">{value}</dd>
    </div>
  );
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(value)
  );
}

function isInternalOrganization(organization: OrganizationWithUsers) {
  return organization.users.some((user) =>
    ["ADMIN", "SUPPORT", "TECHNICIAN"].includes(user.role)
  );
}
