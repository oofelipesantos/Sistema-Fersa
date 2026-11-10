"use client";

import { useEffect, useState } from "react";

export type PitchSection = { id: string; label: string };

const nextKeys = new Set(["ArrowRight", "PageDown"]);
const previousKeys = new Set(["ArrowLeft", "PageUp"]);

/**
 * Presenter helper: side dots show the current section and arrow / page keys
 * (also sent by presentation clickers) jump between sections.
 */
export function PitchNavigator({ sections }: { sections: PitchSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    // Active section: the last one whose top has passed the middle of the viewport.
    function update() {
      const middle = window.innerHeight / 2;
      let current = sections[0]?.id;
      for (const { id } of sections) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= middle)
          current = id;
      }
      setActive(current);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        target?.closest("input, textarea, select, [contenteditable=true]")
      )
        return;
      const direction = nextKeys.has(event.key)
        ? 1
        : previousKeys.has(event.key)
          ? -1
          : 0;
      if (!direction) return;
      const index = sections.findIndex(({ id }) => id === active);
      const next = sections[index + direction];
      if (!next) return;
      event.preventDefault();
      document.getElementById(next.id)?.scrollIntoView({ behavior: "smooth" });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, sections]);

  return (
    <nav
      aria-label="Sections"
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 rounded-full bg-navy-950/40 px-2 py-3 backdrop-blur xl:flex"
    >
      {sections.map(({ id, label }) => (
        <a
          aria-current={active === id ? "true" : undefined}
          className="group relative flex items-center"
          href={`#${id}`}
          key={id}
        >
          <span
            className={`block w-2.5 rounded-full transition-all ${active === id ? "h-6 bg-accent-500" : "h-2.5 bg-white/60 group-hover:bg-white"}`}
          />
          <span className="pointer-events-none absolute left-6 whitespace-nowrap rounded bg-navy-900/90 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
            {label}
          </span>
        </a>
      ))}
    </nav>
  );
}
