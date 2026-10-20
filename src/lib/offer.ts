import type { FlotadorConfig } from "@/content/flotador";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function isValidCents(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function isValidQuantity(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function formatBRL(cents: number): string {
  return brl.format(cents / 100);
}

/** Equivalente por unidade, em centavos (arredondado). null se dados inválidos. */
export function unitPriceCents(
  boxPriceCents: number | null,
  unitsPerBox: number | null,
): number | null {
  if (!isValidCents(boxPriceCents) || !isValidQuantity(unitsPerBox)) return null;
  return Math.round(boxPriceCents / unitsPerBox);
}

export function isApprovedHttpsUrl(url: string | null, approved: boolean): boolean {
  if (!approved || !url) return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/** Parâmetros de campanha repassados da LP para o checkout. */
export const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

/**
 * Copia os parâmetros de campanha da URL atual (`search`) para o link de compra,
 * sem sobrescrever o que o link já traz.
 */
export function withTracking(url: string, search: string): string {
  const target = new URL(url);
  const current = new URLSearchParams(search);
  for (const key of TRACKING_PARAMS) {
    const value = current.get(key);
    if (value && !target.searchParams.has(key)) target.searchParams.set(key, value);
  }
  return target.toString();
}

export interface OfferReadiness {
  enabled: boolean;
  missing: string[];
}

/** Determina se a oferta pode ser habilitada. Todas as condições são obrigatórias. */
export function getOfferReadiness(config: FlotadorConfig): OfferReadiness {
  const missing: string[] = [];
  const { offer, product } = config;
  if (config.status !== "approved" || !offer.commercialApproval)
    missing.push("Aprovação comercial");
  if (!product.sku || !product.volumePerPackage)
    missing.push("Apresentação do produto (SKU e volume)");
  if (!isValidQuantity(product.unitsPerBox)) missing.push("Quantidade de unidades por caixa");
  if (!isValidCents(offer.boxPriceCents)) missing.push("Preço da caixa");
  if (!isApprovedHttpsUrl(offer.purchaseUrl, offer.purchaseUrlApproved))
    missing.push("Destino de compra HTTPS aprovado");
  return { enabled: missing.length === 0, missing };
}
