import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";

export async function ServiceEmptyPage({
  titleKey
}: {
  titleKey:
    | "myWork"
    | "visits"
    | "customers"
    | "products"
    | "technicians"
    | "reports"
    | "settings";
}) {
  const t = await getTranslations("nav");
  const visit = await getTranslations("visit");
  return (
    <div>
      <h1 className="text-2xl font-bold">{t(titleKey)}</h1>
      <Card className="mt-6">
        <CardContent className="p-8 text-center text-sm text-slate-500">
          {visit("empty")}
        </CardContent>
      </Card>
    </div>
  );
}
