import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMockMode() {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";
}
