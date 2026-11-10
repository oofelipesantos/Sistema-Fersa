import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PitchPage } from "@/components/pitch/pitch-page";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pitch" });
  return { title: t("metaTitle"), description: t("hero.subtitle") };
}

export default function Page() {
  return <PitchPage />;
}
