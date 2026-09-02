import { notFound } from "next/navigation";
import {
  MyWorkPage,
  ProductsPage,
  ReportsPage,
  SettingsPage,
  TechniciansPage,
  VisitsPage
} from "@/components/service/service-section-pages";

const sections = [
  "my-work",
  "visits",
  "customers",
  "products",
  "technicians",
  "reports",
  "settings"
] as const;
export default async function ServiceSectionPage({
  params
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sections.includes(section as (typeof sections)[number])) notFound();
  switch (section) {
    case "my-work":
      return <MyWorkPage />;
    case "visits":
      return <VisitsPage />;
    case "products":
      return <ProductsPage />;
    case "technicians":
      return <TechniciansPage />;
    case "reports":
      return <ReportsPage />;
    case "settings":
      return <SettingsPage />;
    case "customers":
      notFound();
  }
}
