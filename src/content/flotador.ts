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

// Conteúdo recebido em perol-lp-github.zip; preços, frete, garantia e ficha técnica vêm da prévia "Prévia LP Perol".
// PRICES usa centavos inteiros, como o restante do projeto.
export type ProductId = "f5" | "lx";
export type Volume = 1 | 5;
export type KitId = "u1" | "u2" | "cx6";
export interface PerolKit {
  id: KitId;
  q: string;
  title: string;
  n: number;
  d: string;
  flag?: string;
  navy?: boolean;
  perks: string[];
}
/**
 * Palco da objeção: a foto e o que ela demonstra, só com fatos já presentes no conteúdo.
 * O dado de apoio (custo por litro, modo de uso) vem de `obj.fact` e aparece como selo verde.
 */
export interface ObjectionStage {
  img: string;
  /** Foto de cena (preenche o quadro) em vez de packshot (frasco isolado). */
  scene?: boolean;
  /** steps = sequência numerada; tags = lista de itens; spec = ficha com rótulo e detalhe. */
  kind: "steps" | "tags" | "spec";
  title: string;
  items: { b: string; s?: string }[];
}
/** Guia rápido do ambiente: dose, passo a passo e o kit indicado (abre no popup do cartão). */
export interface EnvGuide {
  dose: string;
  doseNote: string;
  steps: string[];
  tip?: string;
  pick: { volume: Volume; kit: KitId; why: string };
}
/** Avaliação de cliente. `summary` = texto resumido da avaliação original (sem aspas). */
export interface Review {
  /** Foto enviada pelo cliente (public/img); sem foto o cartão vira só texto. */
  photo?: string;
  name: string;
  city: string;
  uf: string;
  /** AAAA-MM-DD */
  date: string;
  stars: number;
  /** Onde a avaliação foi publicada (ex.: "Magalu"). */
  source?: string;
  summary?: boolean;
  text?: string;
}
export interface SoldProof {
  n: string;
  label: string;
  where: string;
}
export interface ProductContent {
  name: string;
  short: string;
  chip1: string;
  h1a: string;
  h1b: string;
  sub: string;
  ticks: string[];
  /** Fotos da embalagem de 1 L; `gallery5` são as do galão de 5 L. */
  gallery: string[];
  gallery5: string[];
  promo: string[];
  pb4a: string;
  pb4b: string;
  obj: {
    q: string;
    h: string;
    p: string;
    proof: string[];
    /** Fato de apoio, já presente no rótulo ou nos preços; aparece como selo verde abaixo do texto. */
    fact?: string;
    stage: ObjectionStage;
  }[];
  mechTitle: string;
  mechLead: string;
  mech: { b: string; p: string }[];
  mechLabels: [string, string, string, string];
  /**
   * real = dado confirmado (sem isso o campo aparece como "Pendente"); hero = número grande em destaque;
   * sub = rótulo curto sob o valor; info = explicação que abre no popup.
   */
  stats: {
    v: string;
    sub?: string;
    k: string;
    src: string;
    real?: boolean;
    hero?: boolean;
    info?: string;
  }[];
  /** Cartões da ficha técnica; `details` é a tabela que abre no popup. */
  study: { tag: string; h: string; p: string; pin: string; details: { k: string; v: string }[] }[];
  /** before/after = par de fotos da mesma cena; ausente = quadro "Foto real" pendente. */
  ba: { t: string; s: string; before?: string; after?: string }[];
  /** Volume vendido, mostrado sob o título e no topo das avaliações. */
  sold: SoldProof;
  whereTitle: string;
  whereLead: string;
  colA: string;
  iconsA: [string, string][];
  iconsB: [string, string][];
  photos: [file: string, label: string, description?: string, icon?: string][];
  /** Guia por ambiente, indexado pelo arquivo de `photos`; sem guia o cartão não abre popup. */
  envGuide?: Record<string, EnvGuide>;
  /** Avaliações exibidas na seção, na ordem da lista. */
  reviews: Review[];
  faq: { q: string; a?: string; p?: string }[];
}
export const PRICES: Record<ProductId, Record<KitId, number | null>> = {
  f5: { u1: 3990, u2: 6990, cx6: 18497 },
  lx: { u1: 5990, u2: 10697, cx6: 24700 },
};
// Links de compra do checkout Yampi (loja LP - BRASIL), um produto por kit.
export const CHECKOUT: Record<ProductId, Record<KitId, string | null>> = {
  f5: {
    u1: "https://lp-brasil.pay.yampi.com.br/r/JSQ5IH66OL",
    u2: "https://lp-brasil.pay.yampi.com.br/r/BMLB0ON4PV",
    cx6: "https://lp-brasil.pay.yampi.com.br/r/6GWFEREBIT",
  },
  lx: {
    u1: "https://lp-brasil.pay.yampi.com.br/r/GC5SH5F4QJ",
    u2: "https://lp-brasil.pay.yampi.com.br/r/M8UPEF5FBM",
    cx6: "https://lp-brasil.pay.yampi.com.br/r/NUNQOJW71V",
  },
};
/**
 * Liberação comercial da compra na LP Perol (checkout Yampi + Appmax).
 * Aprovada pelo dono da operação em 19/10/2026. Com `approved: false`,
 * o botão volta a avisar que a compra está indisponível.
 */
export const CHECKOUT_RELEASE = { approved: true };
// SKU de cada kit, igual ao cadastro na Yampi. No 5 L, `u2` é a caixa com 2 galões.
export const SKUS: Record<Volume, Record<ProductId, Partial<Record<KitId, string>>>> = {
  1: {
    f5: { u1: "F5-1L-1UN", u2: "F5-1L-2UN", cx6: "F5-1L-CX6" },
    lx: { u1: "LVX-1L-1UN", u2: "LVX-1L-2UN", cx6: "LVX-1L-CX6" },
  },
  5: {
    f5: { u1: "F5-5L-1UN", u2: "F5-5L-CX2" },
    lx: { u1: "LVX-5L-1UN", u2: "LVX-5L-CX2" },
  },
};
export const SHIPPING = {
  paid: { label: "Frete pago + seguro de entrega", days: "3 a 8 dias" },
  free: { label: "Frete grátis", days: "5 a 15 dias" },
};
export const PAYMENT = { methods: ["PIX", "CARTÃO"], cardNoInterest: 3, cardMax: 12 };
export const GUARANTEE_DAYS = 7;
export const KITS: PerolKit[] = [
  {
    id: "u1",
    q: "1 un.",
    title: "1 unidade",
    n: 1,
    d: "1 frasco de 1 L",
    perks: ["1 litro", "Para conhecer o produto"],
  },
  {
    id: "u2",
    q: "2 un.",
    title: "2 unidades",
    n: 2,
    d: "2 frascos de 1 L",
    flag: "Mais pedido",
    navy: true,
    perks: ["2 litros", "Menos por litro que o avulso"],
  },
  {
    id: "cx6",
    q: "Caixa",
    title: "Caixa fechada",
    n: 6,
    d: "6 frascos de 1 L",
    flag: "Melhor custo",
    perks: ["6 litros", "Menor preço por litro", "Ideal para empresas"],
  },
];
// Cada volume tem preço e destino próprios. No 5 L não há caixa com 6: o kit maior é a caixa com 2 galões.
export const PRICES_5L: typeof PRICES = {
  f5: { u1: 11990, u2: 22700, cx6: null },
  lx: { u1: 14990, u2: 24700, cx6: null },
};
// Preço "de" (riscado) por kit, em centavos; sem valor = sem desconto exibido.
type ComparePrices = Record<ProductId, Partial<Record<KitId, number>>>;
export const COMPARE_PRICES: ComparePrices = {
  f5: { u2: 7998, cx6: 23990 },
  lx: { u2: 12090, cx6: 35990 },
};
export const COMPARE_PRICES_5L: ComparePrices = {
  f5: { u2: 28990 },
  lx: { u2: 29997 },
};
export const compareForVolume = (volume: Volume) =>
  volume === 1 ? COMPARE_PRICES : COMPARE_PRICES_5L;
/** Desconto em % inteiro (arredondado para baixo); 0 quando não há preço "de" maior que o atual. */
export const discountPct = (price: number | null, compare?: number) =>
  price !== null && compare && compare > price
    ? Math.floor(((compare - price) / compare) * 100)
    : 0;
// No 5 L, `u2` é a caixa com 2 galões e não existe caixa com 6.
export const CHECKOUT_5L: typeof CHECKOUT = {
  f5: {
    u1: "https://lp-brasil.pay.yampi.com.br/r/SBRST2YXPG",
    u2: "https://lp-brasil.pay.yampi.com.br/r/C5XBUYVC4V",
    cx6: null,
  },
  lx: {
    u1: "https://lp-brasil.pay.yampi.com.br/r/A5TSVKH0YX",
    u2: "https://lp-brasil.pay.yampi.com.br/r/NYGO4DO3GD",
    cx6: null,
  },
};
export const pricesForVolume = (volume: Volume) => (volume === 1 ? PRICES : PRICES_5L);
export const checkoutForVolume = (volume: Volume) => (volume === 1 ? CHECKOUT : CHECKOUT_5L);
export const kitsForVolume = (volume: Volume): PerolKit[] =>
  volume === 1
    ? KITS
    : KITS.map((item) => ({
        ...item,
        d: `${item.n} ${item.n === 1 ? "galão" : "galões"} de 5 L`,
        perks: [`${item.n * volume} litros`, ...item.perks.slice(1)],
      }))
        .filter((item) => item.id !== "cx6")
        .map((item) =>
          item.id === "u2"
            ? {
                ...item,
                q: "Caixa",
                title: "Caixa com 2 galões",
                flag: "Melhor custo",
                navy: false,
                perks: ["10 litros", "Menor preço por litro", "Ideal para uso profissional"],
              }
            : item,
        );

export const DIVS = [
  "Institucional",
  "Tratamento de piso",
  "Industrial",
  "Alimentícia",
  "Frigorífico",
  "Agro",
  "Hotelaria",
  "Odonto hospitalar",
  "Higiene pessoal",
  "Lavanderia",
  "Automotivo",
  "Aviação",
  "Linha Tall",
];

// Avaliações com foto de clientes (public/img/rev-*.webp).
const F5_REVIEWS: Review[] = [
  {
    photo: "rev-f5-1",
    name: "Mariana Albuquerque Reis",
    city: "Uberlândia",
    uf: "MG",
    date: "2026-01-14",
    stars: 5,
    source: "Magalu",
    summary: true,
    text: "Gostou do cheiro e considerou que o produto cumpriu o esperado.",
  },
  {
    photo: "rev-f5-2",
    name: "Rafael Toledo Campos",
    city: "Londrina",
    uf: "PR",
    date: "2026-02-03",
    stars: 5,
    source: "Magalu",
    summary: true,
    text: "Relatou uso por vários anos e bom custo-benefício.",
  },
  {
    photo: "rev-f5-3",
    name: "Cláudia Ferreira Nunes",
    city: "Feira de Santana",
    uf: "BA",
    date: "2026-02-21",
    stars: 5,
    source: "Magalu",
    summary: true,
    text: "Elogiou o aroma e o rendimento.",
  },
  {
    photo: "rev-f5-4",
    name: "Joaquim Bastos Moreira",
    city: "Campinas",
    uf: "SP",
    date: "2026-03-12",
    stars: 5,
    source: "Magalu",
    summary: true,
    text: "Destacou a qualidade e o resultado na limpeza de MDF.",
  },
];
const LX_REVIEWS: Review[] = [
  {
    photo: "rev-lx-1",
    name: "Patrícia Lemos Andrade",
    city: "Florianópolis",
    uf: "SC",
    date: "2026-01-09",
    stars: 5,
    text: "O borrifador facilita a aplicação. Uso depois de organizar a casa para finalizar os tecidos.",
  },
  {
    photo: "rev-lx-2",
    name: "Thiago Ramalho Souza",
    city: "Goiânia",
    uf: "GO",
    date: "2026-01-27",
    stars: 5,
    text: "Gostei bastante do perfume. Usei nas roupas de cama e deixou um cheiro agradável.",
  },
  {
    photo: "rev-lx-3",
    name: "Fernanda Prado Machado",
    city: "Recife",
    uf: "PE",
    date: "2026-02-08",
    stars: 5,
    text: "Achei o aroma um pouco intenso no começo. Com uma quantidade menor, ficou do jeito que gosto.",
  },
  {
    photo: "rev-lx-4",
    name: "Luciana Moraes Teixeira",
    city: "Belo Horizonte",
    uf: "MG",
    date: "2026-02-19",
    stars: 5,
    text: "O cheiro me agradou e a aplicação foi prática. Quero testar também nas toalhas.",
  },
  {
    photo: "rev-lx-5",
    name: "André Siqueira Lopes",
    city: "Natal",
    uf: "RN",
    date: "2026-03-05",
    stars: 5,
    text: "Usei nas cortinas e gostei da sensação de frescor. Foi um toque a mais na limpeza.",
  },
  {
    photo: "rev-lx-6",
    name: "Renata Coutinho Barros",
    city: "Porto Alegre",
    uf: "RS",
    date: "2026-03-24",
    stars: 5,
  },
];
const SOLD: SoldProof = { n: "+ de 7 mil", label: "unidades vendidas", where: "em todo o Brasil" };
// Valores em centavos, formatados aqui porque os textos do conteúdo citam preços já calculados.
const brl = (cents: number) =>
  `R$ ${(cents / 100)
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
/** Preço por unidade na caixa com 6 (1 L). */
const unitInBox = (id: ProductId) => Math.round((PRICES[id].cx6 ?? 0) / 6);
// O Lavix só tem fotos do galão: 1 L e 5 L usam a mesma galeria.
const LX_GALLERY = [
  "lx-5l-frente",
  "lx-5l-angulo-1",
  "lx-5l-angulo-2",
  "lx-5l-angulo-3",
  "lx-5l-rotulo",
  "lx-5l-tampa",
];
export const galleryForVolume = (product: ProductContent, volume: Volume) =>
  volume === 5 ? product.gallery5 : product.gallery;

export const PRODUCTS: Record<ProductId, ProductContent> = {
  f5: {
    name: "F5 Flotador Universal",
    short: "F5 Flotador",
    chip1: "Limpador de uso geral",
    h1a: "F5 Flotador",
    h1b: "Universal",
    sub: "O limpador de uso geral da linha profissional Perol. Solta a sujeira da superfície e deixa sair no pano, em pisos, inox, azulejos e bancadas.",
    ticks: [
      "Linha usada em hotéis, hospitais, escolas e indústrias",
      "Um frasco para pisos, inox, vidros, azulejos e louças",
      "Aplique com pano, mop, pulverizador ou máquina",
    ],
    gallery: [
      "f5-1l-frente",
      "f5-1l-angulo-1",
      "f5-1l-angulo-2",
      "f5-1l-angulo-3",
      "f5-1l-rotulo",
      "f5-1l-tampa",
    ],
    gallery5: [
      "f5-5l-frente",
      "f5-5l-angulo-1",
      "f5-5l-angulo-2",
      "f5-5l-angulo-3",
      "f5-5l-rotulo",
      "f5-5l-tampa",
    ],
    promo: [
      "Envio para todo o Brasil",
      "Compra direta, sem cadastro",
      "Linha profissional Perol",
      "Fábrica ISO 9001",
    ],
    pb4a: "Uso geral",
    pb4b: "Pisos, inox, vidros, azulejos e louças",
    obj: [
      {
        q: "Será que limpa de verdade?",
        h: "A sujeira solta e sai no pano",
        p: "Os tensoativos do F5 envolvem a gordura e as partículas e mantêm tudo em suspensão. Em vez de espalhar a sujeira, você retira com o pano ou com a máquina.",
        proof: ["Ação de flotação"],
        fact: "Diluído no pulverizador, age na hora e sai com pano limpo, sem enxágue.",
        stage: {
          img: "f5-cena-gordura-inox",
          scene: true,
          kind: "steps",
          title: "Como a sujeira sai",
          items: [
            { b: "Os tensoativos chegam na sujeira" },
            { b: "A sujeira é envolvida e flutua" },
            { b: "Você retira tudo no pano" },
          ],
        },
      },
      {
        q: "Vai manchar meu piso?",
        h: "Feito para as superfícies laváveis",
        p: "O rótulo indica uso em pisos frios, cerâmica, porcelanato, azulejos, inox, vidros, fórmica e acrílico. Na primeira vez, teste numa área pequena e escondida.",
        proof: ["Pisos frios", "Inox", "Vidros", "Azulejos"],
        stage: {
          img: "f5-cena-superficies",
          scene: true,
          kind: "tags",
          title: "Superfícies indicadas no rótulo",
          items: [
            { b: "Pisos frios" },
            { b: "Cerâmica" },
            { b: "Porcelanato" },
            { b: "Azulejos" },
            { b: "Inox" },
            { b: "Vidros" },
            { b: "Fórmica" },
            { b: "Acrílico" },
          ],
        },
      },
      {
        q: "Produto profissional não é caro?",
        h: "Rende mais que o de mercado",
        p: "Na caixa com 6 unidades, o custo por litro cai. Com a diluição correta, cada litro vira vários litros de solução de limpeza.",
        proof: ["Diluível"],
        fact: `Na caixa com 6, cada pulverizador de 1 L na diluição 1:10 sai por ${brl(Math.round(unitInBox("f5") / 10))}.`,
        stage: {
          img: "f5-cena-caixa-6",
          scene: true,
          kind: "spec",
          title: "Na caixa",
          items: [
            { b: "Caixa com 6 unidades", s: "O custo por litro cai" },
            { b: "Diluível", s: "Cada litro vira vários litros de solução" },
          ],
        },
      },
      {
        q: "Posso confiar na marca?",
        h: "Fábrica certificada ISO 9001",
        p: "A Perol tem certificação ISO 9001 e atende 13 divisões do mercado profissional, de hospitais e cozinhas industriais a aviação e hotelaria.",
        proof: ["ISO 9001", "13 divisões"],
        stage: {
          img: "f5-cena-laboratorio",
          scene: true,
          kind: "spec",
          title: "Quem fabrica",
          items: [
            { b: "ISO 9001", s: "Gestão de qualidade" },
            { b: "13 divisões", s: "Do hospital à aviação" },
          ],
        },
      },
      {
        q: "E se der problema com o pedido?",
        h: "Compra segura do clique à entrega",
        p: "Você paga direto no checkout seguro e acompanha o envio. Frete pago com seguro chega em 3 a 8 dias, o grátis em 5 a 15 dias, e você tem 7 dias de garantia.",
        proof: ["Checkout seguro", "Garantia de 7 dias"],
        stage: {
          img: "entrega-caminhao",
          scene: true,
          kind: "steps",
          title: "Do clique à entrega",
          items: [
            { b: "Pagamento direto no checkout seguro" },
            { b: "Entrega em 3 a 8 dias com seguro" },
            { b: "7 dias de garantia" },
          ],
        },
      },
    ],
    mechTitle: "Flotação: a sujeira sobe e sai",
    mechLead:
      "O nome vem do jeito que o produto age. Ele não esfrega a sujeira para os lados, ele a solta e deixa em suspensão para ser retirada.",
    mech: [
      {
        b: "Os tensoativos chegam na sujeira",
        p: "As moléculas têm um lado que se liga à gordura e outro que se liga à água.",
      },
      {
        b: "A sujeira é envolvida e flutua",
        p: "Gordura e partículas ficam presas em pequenas esferas e se soltam da superfície.",
      },
      {
        b: "Você retira tudo no pano",
        p: "Com a sujeira em suspensão, um pano úmido ou o mop recolhem sem espalhar.",
      },
    ],
    mechLabels: ["Superfície", "Sujeira", "Tensoativo", "Pano"],
    stats: [
      {
        v: "100 ml",
        sub: "1:10",
        k: "de F5 por litro de água · limpeza diária e manutenção",
        src: "ficha técnica Perol",
        real: true,
        info: "Para o dia a dia, 1 parte de F5 para 10 de água: 100 ml de F5 em 1 litro de água no pulverizador. Aplique, espere a sujeira soltar e retire com pano limpo, sem enxágue.",
      },
      {
        v: "200 ml",
        sub: "1:5",
        k: "de F5 por litro de água · limpeza leve",
        src: "ficha técnica Perol",
        real: true,
        info: "Para sujeira leve em superfícies mais marcadas: 1 parte de F5 para 5 de água, ou seja, 200 ml de F5 em 1 litro de água.",
      },
      {
        v: "500 ml",
        sub: "1:2",
        k: "de F5 por litro de água · limpeza pesada",
        src: "ficha técnica Perol",
        real: true,
        info: "Para gordura, graxa, fuligem e encardido: 1 parte de F5 para 2 de água, ou seja, 500 ml de F5 em 1 litro de água. Teste antes numa área pequena.",
      },
      {
        v: "24",
        k: "meses de validade a partir da fabricação",
        src: "rótulo do produto",
        real: true,
        hero: true,
      },
    ],
    study: [
      {
        tag: "Ficha técnica",
        h: "Uso e diluição",
        p: "Limpador multiuso flotador (APC). Diluído no pulverizador, age na hora e dispensa enxágue.",
        pin: "Ficha técnica Perol",
        details: [
          { k: "Tipo", v: "Limpador flotador multiuso (APC)" },
          { k: "pH", v: "Alcalino" },
          { k: "Limpeza pesada", v: "1:2 · 500 ml de F5 por litro de água" },
          { k: "Limpeza leve", v: "1:5 · 200 ml de F5 por litro de água" },
          { k: "Manutenção diária", v: "1:10 · 100 ml de F5 por litro de água" },
          { k: "Como usar", v: "Pulverize, deixe agir e retire com pano limpo. Sem enxágue." },
          { k: "Embalagens", v: "1 L, 5 L, 20 L e 50 L" },
          { k: "Validade", v: "24 meses a partir da fabricação" },
        ],
      },
      {
        tag: "Ficha técnica",
        h: "Sujidades e superfícies",
        p: "Remove gordura, graxa, óleo e encardido de superfícies laváveis, estofados e carpetes.",
        pin: "Ficha técnica Perol",
        details: [
          {
            k: "Sujidades",
            v: "Gorduras, graxas, óleos, ceras, fuligem, resíduos orgânicos, manchas, incrustações e encardidos",
          },
          {
            k: "Superfícies",
            v: "Cerâmica, esmaltados, vitrificados, inox, alumínio, plásticos, PVC, fórmica e vinil",
          },
          { k: "Tecidos", v: "Estofados, carpetes, tapetes e couro" },
          { k: "Cuidados", v: "Teste antes numa área pequena. Não misture com outros produtos." },
        ],
      },
    ],
    sold: SOLD,
    ba: [
      {
        t: "Assadeira de inox · gordura",
        s: "Comparação ilustrativa",
        before: "f5-ba-inox-antes",
        after: "f5-ba-inox-depois",
      },
      {
        t: "Azulejos · encardido",
        s: "Comparação ilustrativa",
        before: "f5-ba-azulejo-antes",
        after: "f5-ba-azulejo-depois",
      },
      {
        t: "Estofado · mancha",
        s: "Comparação ilustrativa",
        before: "f5-ba-estofado-antes",
        after: "f5-ba-estofado-depois",
      },
    ],
    whereTitle: "Do piso ao inox com o mesmo frasco",
    whereLead: "Superfícies e ambientes indicados no rótulo do F5 Flotador Universal.",
    colA: "Superfícies",
    iconsA: [
      ["tile", "Cerâmica"],
      ["porc", "Porcelanato"],
      ["granite", "Granito"],
      ["steel", "Inox"],
      ["glass", "Vidros"],
      ["bath", "Box e louças"],
    ],
    iconsB: [
      ["hotel", "Hotéis"],
      ["hosp", "Hospitais"],
      ["school", "Escolas"],
      ["ind", "Indústrias"],
      ["kitchen", "Cozinhas"],
      ["condo", "Condomínios"],
    ],
    photos: [
      ["f5-lobby", "Recepções e halls", "Áreas de recepção e circulação.", "hotel"],
      ["f5-mop", "Pisos de alto tráfego", "Rotina de limpeza de pisos.", "tile"],
      ["f5-steel", "Cozinhas industriais", "Superfícies laváveis na cozinha.", "kitchen"],
      ["f5-counter", "Casa e escritório", "Cuidados com os ambientes do dia a dia.", "home"],
    ],
    envGuide: {
      "f5-lobby": {
        dose: "100 ml por litro",
        doseNote: "Diluição 1:10 · manutenção diária",
        steps: [
          "Dilua 100 ml de F5 em 1 litro de água no pulverizador.",
          "Pulverize em balcões, vidros, inox e pisos da recepção.",
          "Espere alguns segundos e retire com pano limpo. Não precisa enxaguar.",
        ],
        tip: "Marcas de mão e gordura no balcão: use 200 ml por litro (1:5).",
        pick: {
          volume: 5,
          kit: "u2",
          why: "Recepção limpa todo dia: a caixa com 2 galões de 5 L rende a rotina do mês.",
        },
      },
      "f5-mop": {
        dose: "200 ml por litro",
        doseNote: "Diluição 1:5 · limpeza leve de pisos",
        steps: [
          "Dilua 200 ml de F5 por litro de água no balde ou pulverizador.",
          "Aplique com o mop sobre o piso, por áreas.",
          "Recolha a sujeira com o mop ou pano úmido. Sem enxágue.",
        ],
        tip: "Piso encardido ou com gordura: suba para 500 ml por litro (1:2).",
        pick: {
          volume: 5,
          kit: "u2",
          why: "Piso de alto tráfego gasta mais: a caixa com 2 galões de 5 L tem o menor custo por litro.",
        },
      },
      "f5-steel": {
        dose: "500 ml por litro",
        doseNote: "Diluição 1:2 · limpeza pesada",
        steps: [
          "Dilua 500 ml de F5 em 1 litro de água no pulverizador.",
          "Pulverize sobre inox, coifas e bancadas com gordura.",
          "Deixe agir alguns segundos e retire com pano limpo.",
        ],
        tip: "Na limpeza do dia a dia da cozinha, 200 ml por litro (1:5) já resolve.",
        pick: {
          volume: 5,
          kit: "u2",
          why: "Cozinha industrial usa a diluição mais forte: a caixa com 2 galões de 5 L é a mais econômica.",
        },
      },
      "f5-counter": {
        dose: "100 ml por litro",
        doseNote: "Diluição 1:10 · uso diário",
        steps: [
          "Dilua 100 ml de F5 em 1 litro de água no pulverizador.",
          "Use em pisos, azulejos, mesas, box e bancadas.",
          "Passe o pano limpo e pronto. Não precisa enxaguar.",
        ],
        tip: "Teste antes numa área pequena e não misture com outros produtos.",
        pick: {
          volume: 1,
          kit: "u2",
          why: "Para casa e escritório, 2 frascos de 1 L rendem muitas limpezas.",
        },
      },
    },
    reviews: F5_REVIEWS,
    faq: [
      {
        q: "Onde posso usar o F5 Flotador?",
        a: "Em superfícies laváveis: pisos frios, cerâmica, porcelanato, azulejos, inox, vidros, fórmica, acrílico, louças e box de banheiro. Teste numa área pequena antes.",
      },
      {
        q: "Precisa diluir?",
        a: "Sim, no pulverizador, por litro de água: 100 ml de F5 (1:10) para a limpeza diária, 200 ml (1:5) para limpeza leve e 500 ml (1:2) para limpeza pesada.",
      },
      { q: "Quanto rende 1 litro?", p: "rendimento por litro" },
      {
        q: "Qual a validade?",
        a: "24 meses a partir da data de fabricação, guardado na embalagem original, em local seco e arejado.",
      },
      {
        q: "Em quantos dias chega?",
        a: "Com frete pago e seguro de entrega, de 3 a 8 dias. Com frete grátis, de 5 a 15 dias.",
      },
      {
        q: "Posso misturar com outro produto?",
        a: "Não. O rótulo orienta não misturar com outros produtos e manter na embalagem original.",
      },
    ],
  },
  lx: {
    name: "Lavix Finalizador",
    short: "Lavix",
    chip1: "Odorizante para tecidos",
    h1a: "Lavix",
    h1b: "Finalizador",
    sub: "O finalizador usado por lavanderias de hotéis e hospitais no fim da lavagem. Deixa cama, mesa e banho com perfume uniforme, sem precisar de mais perfume no processo.",
    ticks: [
      "Indicado para lavanderias hospitalares, hoteleiras e industriais",
      "Para algodão e tecidos mistos de cama, mesa e banho",
      "Na lavadora ou borrifado no tecido seco",
    ],
    gallery: LX_GALLERY,
    gallery5: LX_GALLERY,
    promo: [
      "Envio para todo o Brasil",
      "Compra direta, sem cadastro",
      "Linha profissional Perol",
      "Fábrica ISO 9001",
    ],
    pb4a: "Lavanderia",
    pb4b: "Hospitalar, hoteleira e industrial",
    obj: [
      {
        q: "O cheiro some na secagem?",
        h: "Aplicado no fim, para ficar no tecido",
        p: "O Lavix entra no final da lavagem, no tecido ainda úmido, e segue para a secadora. Ou é borrifado no tecido seco, antes de dobrar.",
        proof: ["Etapa final"],
        fact: "Usado puro, pulverizado na secadora durante a secagem e reforçado antes de embalar.",
        stage: {
          img: "lx-cena-toalha",
          scene: true,
          kind: "steps",
          title: "Onde o Lavix entra",
          items: [
            { b: "A roupa sai limpa da lavagem" },
            { b: "A fragrância se distribui na fibra" },
            { b: "O perfume fica depois de secar" },
          ],
        },
      },
      {
        q: "Vai manchar minha roupa?",
        h: "Indicado para algodão e mistos",
        p: "O rótulo indica uso em tecidos de algodão e tecidos mistos de cama, mesa e banho. Na primeira vez, teste numa parte escondida da peça.",
        proof: ["Algodão", "Tecidos mistos"],
        stage: {
          img: "lx-cena-tecidos",
          scene: true,
          kind: "tags",
          title: "Tecidos indicados no rótulo",
          items: [
            { b: "Algodão" },
            { b: "Tecidos mistos" },
            { b: "Cama" },
            { b: "Mesa" },
            { b: "Banho" },
          ],
        },
      },
      {
        q: "Quanto rende um frasco?",
        h: "Pouca dose por lavagem",
        p: "Como é um finalizador concentrado, a dose por quilo de roupa é pequena. Na caixa, o custo por litro cai ainda mais.",
        proof: ["Concentrado"],
        fact: `Na caixa com 6, o litro do Lavix sai a ${brl(unitInBox("lx"))}, contra ${brl(PRICES.lx.u1 ?? 0)} no frasco avulso.`,
        stage: {
          img: "lx-cena-caixa-6",
          scene: true,
          kind: "spec",
          title: "Concentrado",
          items: [
            { b: "Dose pequena", s: "Por quilo de roupa" },
            { b: "Caixa", s: "O custo por litro cai ainda mais" },
          ],
        },
      },
      {
        q: "Posso confiar na marca?",
        h: "Fábrica certificada ISO 9001",
        p: "A Perol tem certificação ISO 9001 e uma divisão inteira dedicada a lavanderia, além de hotelaria e área hospitalar.",
        proof: ["ISO 9001", "Divisão lavanderia"],
        stage: {
          img: "lx-cena-laboratorio",
          scene: true,
          kind: "spec",
          title: "Quem fabrica",
          items: [
            { b: "ISO 9001", s: "Gestão de qualidade" },
            { b: "13 divisões", s: "Incluindo lavanderia" },
          ],
        },
      },
      {
        q: "E se der problema com o pedido?",
        h: "Compra segura do clique à entrega",
        p: "Você paga direto no checkout seguro e acompanha o envio. Frete pago com seguro chega em 3 a 8 dias, o grátis em 5 a 15 dias, e você tem 7 dias de garantia.",
        proof: ["Checkout seguro", "Garantia de 7 dias"],
        stage: {
          img: "entrega-caminhao",
          scene: true,
          kind: "steps",
          title: "Do clique à entrega",
          items: [
            { b: "Pagamento direto no checkout seguro" },
            { b: "Entrega em 3 a 8 dias com seguro" },
            { b: "7 dias de garantia" },
          ],
        },
      },
    ],
    mechTitle: "Perfume que fica na fibra",
    mechLead:
      "O Lavix entra quando a roupa já está limpa. Ele não lava, ele finaliza: deposita a fragrância nas fibras para durar depois da secagem.",
    mech: [
      {
        b: "A roupa sai limpa da lavagem",
        p: "O Lavix vem depois do enxágue, com o tecido ainda úmido.",
      },
      {
        b: "A fragrância se distribui na fibra",
        p: "O produto é aplicado puro e se espalha por igual pelo tecido.",
      },
      {
        b: "O perfume fica depois de secar",
        p: "Lençóis e toalhas saem da secadora com cheiro de roupa de hotel.",
      },
    ],
    mechLabels: ["Tecido", "Fibra", "Fragrância", "Secagem"],
    stats: [
      {
        v: "Puro",
        sub: "100% produto",
        k: "sem diluir, pulverizado direto no tecido",
        src: "ficha técnica Perol",
        real: true,
        info: "O Lavix Finalizador é usado puro. Pulverize dentro da secadora durante a secagem e, se quiser reforçar, sobre o tecido dentro do saco plástico antes de embalar.",
      },
      {
        v: "Neutro",
        sub: "pH",
        k: "pH da fórmula, para algodão e tecidos mistos",
        src: "ficha técnica Perol",
        real: true,
        info: "pH neutro: indicado para tecidos de algodão e mistos em lavanderias comerciais, hoteleiras e industriais.",
      },
      {
        v: "1 e 5 L",
        sub: "frasco e galão",
        k: "embalagens disponíveis",
        src: "ficha técnica Perol",
        real: true,
        info: "O Lavix Finalizador é vendido em frasco de 1 litro e galão de 5 litros, na fragrância Tradicional.",
      },
      {
        v: "24",
        k: "meses de validade a partir da fabricação",
        src: "rótulo do produto",
        real: true,
        hero: true,
      },
    ],
    study: [
      {
        tag: "Ficha técnica",
        h: "Aplicação e fixação",
        p: "Odorizante de tecidos que fixa o perfume nas roupas. Usado puro, na secadora ou na embalagem.",
        pin: "Ficha técnica Perol",
        details: [
          { k: "Tipo", v: "Odorizante de tecidos e roupas" },
          { k: "Diluição", v: "Puro, sem diluir" },
          { k: "Onde aplicar", v: "Pulverizado dentro da secadora, durante a secagem" },
          { k: "Reforço", v: "Sobre o tecido, dentro do saco plástico, antes de embalar" },
          { k: "Fragrância", v: "Tradicional" },
          { k: "Embalagens", v: "1 L e 5 L" },
        ],
      },
      {
        tag: "Ficha técnica",
        h: "pH e tecidos",
        p: "Fórmula de pH neutro para algodão e tecidos mistos de cama, mesa e banho.",
        pin: "Ficha técnica Perol",
        details: [
          { k: "pH", v: "Neutro" },
          { k: "Tecidos", v: "Algodão e tecidos mistos" },
          {
            k: "Indicado para",
            v: "Lavanderias comerciais, hoteleiras e industriais, e uso em casa",
          },
          {
            k: "Dosagem",
            v: "Pode variar conforme a sujidade das roupas e o tipo de processo de lavagem",
          },
          { k: "Validade", v: "24 meses a partir da fabricação" },
        ],
      },
    ],
    sold: SOLD,
    ba: [
      {
        t: "Jogo de lençol",
        s: "Comparação ilustrativa",
        before: "lx-ba-lencol-antes",
        after: "lx-ba-lencol-depois",
      },
      {
        t: "Camiseta",
        s: "Comparação ilustrativa",
        before: "lx-ba-camiseta-antes",
        after: "lx-ba-camiseta-depois",
      },
      {
        t: "Calça de linho",
        s: "Comparação ilustrativa",
        before: "lx-ba-calca-antes",
        after: "lx-ba-calca-depois",
      },
      {
        t: "Camisa social",
        s: "Comparação ilustrativa",
        before: "lx-ba-camisa-antes",
        after: "lx-ba-camisa-depois",
      },
    ],
    whereTitle: "O toque final da lavanderia profissional",
    whereLead: "Tecidos e ambientes indicados no rótulo do Lavix Finalizador.",
    colA: "Tecidos",
    iconsA: [
      ["cotton", "Algodão"],
      ["sheet", "Lençóis"],
      ["towel", "Toalhas"],
      ["uniform", "Uniformes"],
      ["pillow", "Fronhas"],
      ["tile", "Tecidos mistos"],
    ],
    iconsB: [
      ["hotel", "Hotéis"],
      ["hosp", "Hospitais"],
      ["laundry", "Lavanderias"],
      ["ind", "Indústrias"],
      ["condo", "Pousadas"],
      ["home", "Casa"],
    ],
    photos: [
      ["lx-machines", "Lavanderias", "Finalização na rotina da lavanderia.", "laundry"],
      ["lx-towels", "Toalhas e banho", "Cuidados com os tecidos de banho.", "towel"],
      ["lx-spray", "Roupa de cama", "Lençóis e fronhas na etapa de finalização.", "sheet"],
      ["lx-front", "Rotina da casa", "Cuidados com os tecidos do dia a dia.", "home"],
    ],
    envGuide: {
      "lx-machines": {
        dose: "Puro",
        doseNote: "Sem diluir · direto na secadora",
        steps: [
          "Use o Lavix puro, sem misturar com água.",
          "Pulverize dentro da secadora durante o processo de secagem.",
          "Se quiser reforçar, pulverize sobre o tecido no saco plástico antes de embalar.",
        ],
        tip: "A dose pode variar conforme a sujidade e o processo de cada lavanderia.",
        pick: {
          volume: 5,
          kit: "u2",
          why: "Lavanderia usa todo dia: a caixa com 2 galões de 5 L tem o menor custo por litro.",
        },
      },
      "lx-towels": {
        dose: "Puro",
        doseNote: "Sem diluir · sobre o tecido úmido",
        steps: [
          "Use o Lavix puro, sem misturar com água.",
          "Pulverize sobre as toalhas ainda úmidas.",
          "Coloque para secar como de costume.",
        ],
        tip: "Indicado para algodão e tecidos mistos.",
        pick: {
          volume: 5,
          kit: "u2",
          why: "Toalhas de hotel e pousada giram muito: 2 galões de 5 L dão conta.",
        },
      },
      "lx-spray": {
        dose: "Puro",
        doseNote: "Sem diluir · antes de secar e embalar",
        steps: [
          "Use o Lavix puro, sem misturar com água.",
          "Pulverize sobre lençóis e fronhas ainda úmidos e leve para secar.",
          "Para guardar perfumado, pulverize de novo antes de embalar.",
        ],
        tip: "Indicado para algodão e tecidos mistos de cama.",
        pick: {
          volume: 5,
          kit: "u1",
          why: "Para enxoval de cama, 1 galão de 5 L é um bom começo.",
        },
      },
      "lx-front": {
        dose: "Puro",
        doseNote: "Sem diluir · no fim da lavagem",
        steps: [
          "Use o Lavix puro, sem misturar com água.",
          "Pulverize sobre a roupa ainda úmida, depois de lavar.",
          "Deixe secar normalmente no varal ou na secadora.",
        ],
        tip: "Mantenha na embalagem original e não misture com outros produtos.",
        pick: {
          volume: 1,
          kit: "u2",
          why: "Para a roupa da casa, 2 frascos de 1 L são suficientes.",
        },
      },
    },
    reviews: LX_REVIEWS,
    faq: [
      {
        q: "Em quais tecidos posso usar?",
        a: "Algodão e tecidos mistos: roupa de cama, mesa e banho e tecidos em geral.",
      },
      {
        q: "Como aplico?",
        a: "Puro, sobre o tecido ainda molhado no fim da lavagem, ou borrifado sobre o tecido seco antes de dobrar ou embalar.",
      },
      { q: "Quanto usar por lavagem?", p: "dose por kg de roupa" },
      {
        q: "Qual a validade?",
        a: "24 meses a partir da data de fabricação, na embalagem original.",
      },
      {
        q: "Em quantos dias chega?",
        a: "Com frete pago e seguro de entrega, de 3 a 8 dias. Com frete grátis, de 5 a 15 dias.",
      },
      { q: "O perfume dura quanto tempo?", p: "teste de fixação" },
    ],
  },
};
