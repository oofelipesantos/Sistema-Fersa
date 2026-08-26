"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";

export function PartNumberFinder({
  label,
  placeholder
}: {
  label: string;
  placeholder: string;
}) {
  const [partNumber, setPartNumber] = useState("F15123");
  const common = useTranslations("common");
  const router = useRouter();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (partNumber.trim())
      router.push(`/products/${partNumber.trim().toUpperCase()}`);
  }
  return (
    <form className="space-y-3" onSubmit={submit}>
      <label className="text-sm font-bold" htmlFor="partNumber">
        {label}
      </label>
      <div className="flex gap-2">
        <Input
          className="min-w-0 flex-1"
          id="partNumber"
          onChange={(event) => setPartNumber(event.target.value)}
          placeholder={placeholder}
          value={partNumber}
        />
        <button
          aria-label={common("goToProduct")}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-700 text-white"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
