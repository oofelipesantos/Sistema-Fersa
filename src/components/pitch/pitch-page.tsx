"use client";

import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  CircleCheck,
  ClipboardList,
  Factory,
  FileWarning,
  Globe2,
  Headset,
  Languages,
  Layers,
  MessagesSquare,
  PackageSearch,
  Play,
  ScanLine,
  SearchX,
  ShieldCheck,
  Smartphone,
  Ticket,
  TimerReset,
  Wrench
} from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BearingMark } from "@/components/layout/bearing-mark";
import { Brand } from "@/components/layout/brand";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { DemoPersonas } from "@/components/portal/demo-personas";
import { Link } from "@/i18n/navigation";
import { PitchNavigator, type PitchSection } from "./pitch-navigator";

type Item = { title: string; description: string };

const sectionIds = [
  "inicio",
  "fersa",
  "problema",
  "solucao",
  "jornada",
  "demo",
  "piloto"
] as const;

const problemIcons = [SearchX, Layers, TimerReset, FileWarning];
const solutionLinks = [
  { href: "/scan", icon: ScanLine },
  { href: "/products", icon: PackageSearch },
  { href: "/knowledge-base", icon: BookOpen },
  { href: "/tickets/new", icon: Ticket },
  { href: "/auth/login?returnTo=/service", icon: Headset },
  { href: "/products/F15097", icon: Languages, switchLocale: true }
] as const satisfies ReadonlyArray<{
  href: string;
  icon: typeof ScanLine;
  switchLocale?: boolean;
}>;
const journeyIcons = [
  ScanLine,
  BookOpen,
  Wrench,
  ClipboardList,
  MessagesSquare,
  CircleCheck
];
const readinessIcons = [Smartphone, Globe2, ShieldCheck, ChartNoAxesCombined];

export function PitchPage() {
  const t = useTranslations("pitch");
  const locale = useLocale();
  const stats = t.raw("about.stats") as { value: string; label: string }[];
  const sectors = t.raw("about.sectors") as string[];
  const problems = t.raw("problem.items") as Item[];
  const solutions = t.raw("solution.items") as (Item & { cta: string })[];
  const journey = t.raw("journey.steps") as Item[];
  const phases = t.raw("pilot.phases") as (Item & { label: string })[];
  const metrics = t.raw("pilot.metrics") as string[];
  const readiness = t.raw("readiness.items") as Item[];
  const sections = useMemo<PitchSection[]>(
    () => sectionIds.map((id) => ({ id, label: t(`nav.${id}`) })),
    [t]
  );

  return (
    <div className="bg-white text-slate-900">
      <PitchNavigator sections={sections} />

      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Brand tone="light" />
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher compact />
            <Link
              className="hidden min-h-12 items-center gap-2 rounded-lg bg-accent-500 px-4 text-sm font-bold text-white transition hover:bg-accent-600 sm:inline-flex"
              href="/"
            >
              {t("nav.enterDemo")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative isolate overflow-hidden bg-navy-950 text-white"
        id="inicio"
      >
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div
          className="absolute -right-40 -top-40 -z-10 text-white/[0.04] sm:-right-24"
          aria-hidden
        >
          <BearingMark className="h-[640px] w-[640px] animate-spin-slow" />
        </div>
        <div
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-950 to-transparent"
          aria-hidden
        />
        <div className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-400">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100/85">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 font-bold text-white shadow-lift transition hover:bg-accent-600"
                href="#demo"
              >
                <Play className="h-4 w-4" aria-hidden />
                {t("hero.ctaDemo")}
              </a>
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 font-bold text-white transition hover:bg-white/10"
                href="#jornada"
              >
                {t("hero.ctaJourney")}
              </a>
            </div>
            <p className="mt-8 hidden text-sm text-blue-100/60 lg:block">
              {t("hero.hint")}
            </p>
          </div>
          <div className="relative hidden lg:-mr-48 lg:block xl:-mr-64">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl">
              <Image
                alt={t("hero.desktopAlt")}
                className="rounded-xl"
                height={860}
                preload
                src="/pitch/service-desk.png"
                width={1366}
              />
            </div>
            <div className="absolute -bottom-20 -left-12 w-44 rounded-[1.75rem] border-4 border-navy-800 bg-navy-800 shadow-2xl">
              <Image
                alt={t("hero.mobileAlt")}
                className="rounded-[1.4rem]"
                height={844}
                preload
                src="/pitch/mobile-home.png"
                width={390}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Fersa */}
      <section className="scroll-mt-0 bg-white py-20 sm:py-28" id="fersa">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={t("about.eyebrow")}
            title={t("about.title")}
            body={t("about.body")}
          />
          <dl className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                className="rounded-2xl border bg-steel-50 p-4 sm:p-6"
                key={stat.label}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-extrabold tracking-tight text-navy-700 sm:text-4xl">
                  {stat.value}
                </dd>
                <dd className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Factory className="mr-1 h-5 w-5 text-navy-700" aria-hidden />
            {sectors.map((sector) => (
              <span
                className="rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-sm font-semibold text-navy-700"
                key={sector}
              >
                {sector}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">{t("about.source")}</p>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-steel-50 py-20 sm:py-28" id="problema">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={t("problem.eyebrow")}
            title={t("problem.title")}
            body={t("problem.body")}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {problems.map((item, index) => {
              const Icon = problemIcons[index % problemIcons.length];
              return (
                <div
                  className="flex gap-4 rounded-2xl border bg-white p-6 shadow-card"
                  key={item.title}
                >
                  <span className="h-fit rounded-xl bg-red-50 p-3 text-red-600">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-white py-20 sm:py-28" id="solucao">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={t("solution.eyebrow")}
            title={t("solution.title")}
            body={t("solution.body")}
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((item, index) => {
              const link = solutionLinks[index % solutionLinks.length];
              const Icon = link.icon;
              return (
                <Link
                  className="group flex flex-col rounded-2xl border bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-navy-600 hover:shadow-lift"
                  href={link.href}
                  key={item.title}
                  locale={
                    "switchLocale" in link
                      ? locale === "es"
                        ? "en"
                        : "es"
                      : undefined
                  }
                >
                  <span className="w-fit rounded-xl bg-navy-700 p-3 text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 flex-1 leading-7 text-slate-600">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-600">
                    {item.cta}
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section
        className="relative overflow-hidden bg-navy-900 py-20 text-white sm:py-28"
        id="jornada"
      >
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={t("journey.eyebrow")}
            title={t("journey.title")}
            body={t("journey.body")}
            tone="dark"
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {journey.map((step, index) => {
              const Icon = journeyIcons[index % journeyIcons.length];
              return (
                <li
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-5"
                  key={step.title}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-3xl font-extrabold text-white/15">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100/75">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-400">
                {t("journey.publicLabel")}
              </p>
              <p className="mt-2 leading-7 text-blue-100/85">
                {t("journey.publicText")}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-400">
                {t("journey.protectedLabel")}
              </p>
              <p className="mt-2 leading-7 text-blue-100/85">
                {t("journey.protectedText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live demo */}
      <section
        className="relative overflow-hidden bg-navy-950 py-20 text-white sm:py-28"
        id="demo"
      >
        <div
          className="absolute -bottom-48 -left-48 text-white/[0.04]"
          aria-hidden
        >
          <BearingMark className="h-[560px] w-[560px] animate-spin-slow" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow={t("demo.eyebrow")}
              title={t("demo.title")}
              body={t("demo.body")}
              tone="dark"
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 font-bold text-navy-900 transition hover:bg-blue-50"
                href="/products/F400009"
              >
                <PackageSearch className="h-4 w-4" aria-hidden />
                {t("demo.publicProduct")}
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 font-bold text-white transition hover:bg-white/10"
                href="/knowledge-base"
              >
                <BookOpen className="h-4 w-4" aria-hidden />
                {t("demo.publicDiagnosis")}
              </Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-accent-400">
              {t("demo.personasLabel")}
            </p>
            <DemoPersonas variant="dark" />
            <p className="mt-4 text-sm text-blue-100/60">{t("demo.note")}</p>
          </div>
        </div>
      </section>

      {/* Pilot */}
      <section className="bg-white py-20 sm:py-28" id="piloto">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={t("pilot.eyebrow")}
            title={t("pilot.title")}
            body={t("pilot.body")}
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {phases.map((phase, index) => (
              <div
                className="relative rounded-2xl border bg-steel-50 p-6"
                key={phase.title}
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">
                  {phase.label}
                </p>
                <h3 className="mt-2 text-xl font-bold">{phase.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {phase.description}
                </p>
                <span
                  className="absolute right-6 top-6 text-4xl font-extrabold text-navy-100"
                  aria-hidden
                >
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-navy-200 bg-navy-50 p-6">
            <h3 className="font-bold text-navy-900">
              {t("pilot.metricsTitle")}
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <li className="flex gap-2 text-sm leading-6" key={metric}>
                  <CircleCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-600"
                    aria-hidden
                  />
                  {metric}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              {t("pilot.metricsNote")}
            </p>
          </div>

          <div className="mt-16">
            <h3 className="text-center text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              {t("readiness.title")}
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {readiness.map((item, index) => {
                const Icon = readinessIcons[index % readinessIcons.length];
                return (
                  <div className="text-center" key={item.title}>
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <p className="mt-3 font-bold">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <BearingMark className="h-12 w-12 text-accent-400" />
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("closing.title")}
          </h2>
          <Link
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-accent-500 px-6 font-bold text-white transition hover:bg-accent-600"
            href="/"
          >
            {t("nav.enterDemo")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
      <footer className="bg-navy-950 px-4 py-6 text-center text-xs leading-5 text-blue-100/50">
        {t("footer")}
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  tone = "light"
}: {
  eyebrow: string;
  title: string;
  body: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="max-w-3xl">
      <p
        className={`text-xs font-bold uppercase tracking-[0.18em] ${dark ? "text-accent-400" : "text-accent-600"}`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p
        className={`mt-4 text-lg leading-8 ${dark ? "text-blue-100/80" : "text-slate-600"}`}
      >
        {body}
      </p>
    </div>
  );
}
