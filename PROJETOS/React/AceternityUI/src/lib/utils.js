import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes do Tailwind sem conflito.
 * Todos os componentes da Aceternity UI importam esta função de "@/lib/utils".
 *
 * cn("p-4 text-white", ativo && "bg-sky-600", "p-8") -> "text-white bg-sky-600 p-8"
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
