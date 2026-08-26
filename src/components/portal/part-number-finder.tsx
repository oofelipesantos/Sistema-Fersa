"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { FieldMessage } from "@/components/ui/form-message";
import {
  partNumberSchema,
  type PartNumberValues
} from "@/features/products/product-schema";
import { useRouter } from "@/i18n/navigation";

export function PartNumberFinder({
  label,
  placeholder
}: {
  label: string;
  placeholder: string;
}) {
  const common = useTranslations("common");
  const portal = useTranslations("portal");
  const router = useRouter();
  const form = useForm<PartNumberValues>({
    resolver: zodResolver(partNumberSchema),
    defaultValues: { partNumber: "F15123" }
  });
  function submit(values: PartNumberValues) {
    router.push(`/products/${values.partNumber.trim().toUpperCase()}`);
  }
  return (
    <form className="space-y-3" noValidate onSubmit={form.handleSubmit(submit)}>
      <label className="text-base font-bold" htmlFor="partNumber">
        {label}
      </label>
      <div className="flex gap-2">
        <Input
          className="min-w-0 flex-1"
          id="partNumber"
          placeholder={placeholder}
          {...form.register("partNumber")}
        />
        <button
          aria-label={common("goToProduct")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-700 text-white"
          type="submit"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <FieldMessage id="part-number-error">
        {form.formState.errors.partNumber
          ? portal("partNumberInvalid")
          : undefined}
      </FieldMessage>
    </form>
  );
}
