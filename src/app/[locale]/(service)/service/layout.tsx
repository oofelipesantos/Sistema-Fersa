import { ServiceShell } from "@/components/layout/service-shell";

export default function ServiceLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <ServiceShell>{children}</ServiceShell>;
}
