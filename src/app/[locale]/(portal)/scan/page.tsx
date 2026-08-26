import { getTranslations } from "next-intl/server";
import { QrScanner } from "@/components/portal/qr-scanner";

export default async function ScanPage() {
  const t = await getTranslations("scanner");
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-2 text-sm text-slate-500">{t("description")}</p>
      <div className="mt-6">
        <QrScanner />
      </div>
    </div>
  );
}
