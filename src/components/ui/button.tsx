import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg text-base font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-navy-700 text-white hover:bg-navy-900",
        outline:
          "border border-steel-200 bg-white text-slate-700 hover:bg-steel-50",
        ghost: "text-slate-600 hover:bg-steel-100",
        danger: "bg-red-600 text-white hover:bg-red-700"
      },
      size: {
        default: "h-12 px-4",
        sm: "h-12 px-3 text-sm",
        lg: "h-12 px-5",
        icon: "h-12 w-12"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}

export { buttonVariants };
