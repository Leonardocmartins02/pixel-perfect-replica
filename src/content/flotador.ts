/**
 * Conteúdo e configuração do advertorial do Flotador Perol.
 * Regra: dado ausente = null / lista vazia. Nunca inventar valores.
 * Preços em centavos (BRL). Custos, margens e acordos com fornecedor NÃO entram aqui.
 */

export type ApprovalStatus = "draft" | "approved";

export interface Product {
  brand: string;
  workingName: string;
  sku: string | null;
  volumePerPackage: string | null; // ex.: "1 L" — pendente
  unitsPerBox: number | null;
  audience: string | null;
  applications: string[];
  benefits: string[];
  restrictions: string[];
  usageInstructions: string[];
}

export interface EditorialContent {
  h1: string;
  intro: string;
  buyerProblem: string | null;
  productExplanation: string | null;
  closing: string;
}

export interface MediaAsset {
  kind: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
}

export interface DemoMaterials {
  heroImages: MediaAsset[]; // fotos do palco do hero, em rodízio; vazia = "Pendente"
  demonstration: MediaAsset | null;
}

export interface Offer {
  boxPriceCents: number | null;
  deliveryConditions: string | null;
  purchaseUrl: string | null;
  purchaseUrlApproved: boolean;
  commercialApproval: boolean;
}

export interface Seller {
  companyName: string | null;
  taxId: string | null;
  supportChannel: string | null;
}

export interface FaqItem {
  question: string;
  answer: string | null;
}

export interface FlotadorConfig {
  status: ApprovalStatus;
  product: Product;
  editorial: EditorialContent;
  media: DemoMaterials;
  offer: Offer;
  seller: Seller;
  faq: FaqItem[];
}

export const flotador: FlotadorConfig = {
  status: "draft",
  product: {
    brand: "Perol",
    workingName: "Flotador Perol",
    sku: null,
    volumePerPackage: null,
    unitsPerBox: null,
    audience: null,
    applications: [],
    benefits: [],
    restrictions: [],
    usageInstructions: [],
  },
  editorial: {
    h1: "Conheça o Flotador Perol e a proposta de compra por caixa",
    intro:
      "Esta página apresenta o Flotador Perol e explica como funciona a proposta de compra por caixa. As informações técnicas e comerciais serão publicadas após validação.",
    buyerProblem: null,
    productExplanation: null,
    closing:
      "A proposta é simples: o Flotador Perol, vendido por caixa. Os detalhes da caixa e as condições de compra serão apresentados aqui assim que forem confirmados.",
  },
  media: {
    heroImages: [],
    demonstration: null,
  },
  offer: {
    boxPriceCents: null,
    deliveryConditions: null,
    purchaseUrl: null,
    purchaseUrlApproved: false,
    commercialApproval: false,
  },
  seller: {
    companyName: null,
    taxId: null,
    supportChannel: null,
  },
  faq: [
    { question: "Qual é a apresentação do produto e o volume de cada embalagem?", answer: null },
    { question: "Quantas unidades vêm em cada caixa?", answer: null },
    { question: "Para quais aplicações o Flotador Perol é indicado?", answer: null },
    { question: "Há cuidados ou restrições de uso?", answer: null },
    { question: "Como faço a compra?", answer: null },
    { question: "Para quais regiões há entrega e em quanto tempo?", answer: null },
  ],
};
