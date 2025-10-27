import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export { useDialogManager } from "@/hooks/use-dialog-manager"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
