import { Brand } from "@/components/layout/brand";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { RegistrationCard } from "@/components/portal/registration-card";

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-steel-50">
      <header className="flex items-center justify-between p-5">
        <Brand />
        <LanguageSwitcher />
      </header>
      <section className="flex flex-1 items-center justify-center p-4 pb-10 sm:p-6">
        <RegistrationCard />
      </section>
    </main>
  );
}
