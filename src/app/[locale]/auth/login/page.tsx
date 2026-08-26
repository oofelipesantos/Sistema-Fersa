import { AuthCard } from "@/components/portal/auth-card";
import { Brand } from "@/components/layout/brand";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  return (
    <main className="flex min-h-dvh flex-col bg-steel-50">
      <header className="flex items-center justify-between p-5">
        <Brand />
        <LanguageSwitcher />
      </header>
      <section className="flex flex-1 items-center justify-center p-5">
        <AuthCard returnTo={returnTo} />
      </section>
    </main>
  );
}
