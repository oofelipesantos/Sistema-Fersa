import { Brand } from "@/components/layout/brand";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { UpdatePasswordCard } from "@/components/portal/update-password-card";

export default function UpdatePasswordPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-steel-50">
      <header className="flex items-center justify-between p-5">
        <Brand />
        <LanguageSwitcher />
      </header>
      <section className="flex flex-1 items-center justify-center p-5">
        <UpdatePasswordCard />
      </section>
    </main>
  );
}
