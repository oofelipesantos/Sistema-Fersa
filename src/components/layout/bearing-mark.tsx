import { cn } from "@/lib/utils";

/** Stylized bearing (outer ring, rolling elements and bore) used as brand mark. */
export function BearingMark({ className }: { className?: string }) {
  const balls = Array.from({ length: 8 }, (_, index) => {
    const angle = (index / 8) * Math.PI * 2;
    return { cx: 16 + Math.cos(angle) * 9.5, cy: 16 + Math.sin(angle) * 9.5 };
  });
  return (
    <svg
      aria-hidden
      className={cn("h-5 w-5", className)}
      fill="none"
      viewBox="0 0 32 32"
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="5" stroke="currentColor" strokeWidth="2.5" />
      {balls.map(({ cx, cy }) => (
        <circle
          cx={cx.toFixed(2)}
          cy={cy.toFixed(2)}
          fill="currentColor"
          key={`${cx}-${cy}`}
          r="2.1"
        />
      ))}
    </svg>
  );
}
