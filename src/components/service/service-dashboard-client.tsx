"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { getTicketRepository } from "@/repositories/repository-factory";
import type { DashboardMetrics, Locale, Ticket } from "@/types/domain";
import { Dashboard } from "./dashboard";

export function ServiceDashboardClient({ locale }: { locale: Locale }) {
  const t = useTranslations("dashboard");
  const common = useTranslations("common");
  const [data, setData] = useState<{
    metrics: DashboardMetrics;
    tickets: Ticket[];
  }>();
  const [error, setError] = useState(false);
  useEffect(() => {
    const repository = getTicketRepository();
    Promise.all([repository.getDashboardMetrics(), repository.list()])
      .then(([metrics, tickets]) => setData({ metrics, tickets }))
      .catch(() => setError(true));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-base text-slate-600">{t("subtitle")}</p>
      <div className="mt-6">
        {error ? (
          <Card>
            <CardContent className="p-7 text-center" role="alert">
              {t("loadError")}
            </CardContent>
          </Card>
        ) : data ? (
          <Dashboard
            locale={locale}
            metrics={data.metrics}
            tickets={data.tickets}
          />
        ) : (
          <p className="p-8 text-center" role="status">
            {common("loading")}
          </p>
        )}
      </div>
    </div>
  );
}
