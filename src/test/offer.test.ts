import { describe, expect, it } from "vitest";
import { flotador, type FlotadorConfig } from "@/content/flotador";
import { formatBRL, getOfferReadiness, unitPriceCents } from "@/lib/offer";

// Dados fictícios só para teste — nunca usados na página.
const ready = (): FlotadorConfig => ({
  ...flotador,
  status: "approved",
  product: { ...flotador.product, sku: "TESTE-SKU", volumePerPackage: "1 L", unitsPerBox: 12 },
  offer: { ...flotador.offer, boxPriceCents: 12000, purchaseUrl: "https://exemplo.test/c", purchaseUrlApproved: true, commercialApproval: true },
});

describe("configuração inicial", () => {
  it("começa em draft, sem aprovação e sem preço fictício", () => {
    expect(flotador.status).toBe("draft");
    expect(flotador.offer.commercialApproval).toBe(false);
    expect(flotador.offer.boxPriceCents).toBeNull();
    expect(flotador.product.unitsPerBox).toBeNull();
    expect(flotador.offer.purchaseUrl).toBeNull();
  });
  it("oferta indisponível com dados pendentes", () => {
    expect(getOfferReadiness(flotador).enabled).toBe(false);
  });
});

describe("getOfferReadiness", () => {
  it("habilita somente com todos os requisitos", () => {
    expect(getOfferReadiness(ready()).enabled).toBe(true);
  });
  it("exige aprovação comercial", () => {
    const c = ready(); c.offer.commercialApproval = false;
    expect(getOfferReadiness(c).enabled).toBe(false);
  });
  it("exige apresentação do produto", () => {
    const c = ready(); c.product.sku = null;
    expect(getOfferReadiness(c).enabled).toBe(false);
  });
  it("rejeita quantidade zero", () => {
    const c = ready(); c.product.unitsPerBox = 0;
    expect(getOfferReadiness(c).enabled).toBe(false);
  });
  it("rejeita preço zero", () => {
    const c = ready(); c.offer.boxPriceCents = 0;
    expect(getOfferReadiness(c).enabled).toBe(false);
  });
  it("rejeita URL http", () => {
    const c = ready(); c.offer.purchaseUrl = "http://exemplo.test/c";
    expect(getOfferReadiness(c).enabled).toBe(false);
  });
  it("rejeita URL não aprovada", () => {
    const c = ready(); c.offer.purchaseUrlApproved = false;
    expect(getOfferReadiness(c).enabled).toBe(false);
  });
});

describe("preço por unidade", () => {
  it("calcula 12000 / 12 = 1000 centavos", () => {
    expect(unitPriceCents(12000, 12)).toBe(1000);
  });
  it("não divide por zero nem aceita nulos", () => {
    expect(unitPriceCents(12000, 0)).toBeNull();
    expect(unitPriceCents(null, 12)).toBeNull();
    expect(unitPriceCents(12000, null)).toBeNull();
  });
  it("formata em reais", () => {
    expect(formatBRL(12345).replace(/\s/g, " ")).toBe("R$ 123,45");
  });
});
