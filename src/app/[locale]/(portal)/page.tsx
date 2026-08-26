import { PortalHome } from "@/components/portal/portal-home";
import type { Locale } from "@/types/domain";

export default async function PortalPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <PortalHome locale={locale} />;
}
