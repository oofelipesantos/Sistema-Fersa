import { notFound } from "next/navigation";
import { ServiceEmptyPage } from "@/components/service/service-empty-page";

const sections = [
  "my-work",
  "visits",
  "customers",
  "products",
  "technicians",
  "reports",
  "settings"
] as const;
const keys = {
  "my-work": "myWork",
  visits: "visits",
  customers: "customers",
  products: "products",
  technicians: "technicians",
  reports: "reports",
  settings: "settings"
} as const;
export default async function ServiceSectionPage({
  params
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sections.includes(section as (typeof sections)[number])) notFound();
  return <ServiceEmptyPage titleKey={keys[section as keyof typeof keys]} />;
}
