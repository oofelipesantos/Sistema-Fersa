import { getTranslations } from "next-intl/server";
import { Dashboard } from "@/components/service/dashboard";
import { getTicketRepository } from "@/repositories/repository-factory";
import type { Locale } from "@/types/domain";

export default async function ServiceDashboardPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const repository = getTicketRepository();
  const [metrics, tickets] = await Promise.all([
    repository.getDashboardMetrics(),
    repository.list()
  ]);
  const t = await getTranslations("dashboard");
  return (
    <div>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      <div className="mt-6">
        <Dashboard locale={locale} metrics={metrics} tickets={tickets} />
      </div>
    </div>
  );
}
