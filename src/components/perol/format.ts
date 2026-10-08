import { formatBRL } from "@/lib/offer";
export const img = (name: string) => `/img/${name}.webp`;
export const money = (cents: number | null) => (cents === null ? "R$ ––,––" : formatBRL(cents));
