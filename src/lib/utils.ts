import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sitePath = "StudyGuideIO";

export function ensureError(error: unknown) {
  const isError = error instanceof Error;
  if (!isError) throw new Error("Previously thrown object was not an error");

  const errorObj = error as Error;
  return errorObj;
}
