import { ServiceDashboardClient } from "@/components/service/service-dashboard-client";
import type { Locale } from "@/types/domain";

export default async function ServiceDashboardPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <ServiceDashboardClient locale={locale} />;
}
