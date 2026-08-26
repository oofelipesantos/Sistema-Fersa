import { AlertCircle } from "lucide-react";

export function FieldMessage({
  id,
  children
}: {
  id: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <span
      className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700"
      id={id}
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {children}
    </span>
  );
}

export function ErrorSummary({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div
      className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-800"
      role="alert"
      tabIndex={-1}
    >
      {children}
    </div>
  );
}
