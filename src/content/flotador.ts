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

// Conteúdo recebido em perol-lp-github.zip. Condições comerciais seguem pendentes.
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
 * O que falta (laudo, prazo, dose) vem de `obj.pend` e aparece como "Pendente".
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
export interface ProductContent {
  name: string;
  short: string;
  chip1: string;
  h1a: string;
  h1b: string;
  sub: string;
  ticks: string[];
  gallery: string[];
  promo: string[];
  pb4a: string;
  pb4b: string;
  obj: {
    q: string;
    h: string;
    p: string;
    proof: string[];
    pend?: string;
    stage: ObjectionStage;
  }[];
  mechTitle: string;
  mechLead: string;
  mech: { b: string; p: string }[];
  mechLabels: [string, string, string, string];
  stats: { v: string; k: string; src: string; real?: boolean }[];
  study: { h: string; p: string; pin: string }[];
  /** before/after = par de fotos da mesma cena; ausente = quadro "Foto real" pendente. */
  ba: { t: string; s: string; before?: string; after?: string }[];
  /** Nota real, total de avaliações e onde elas estão; ausente = campo "Pendente" (nunca inventar). */
  rating?: { score: number; count: number; source: string };
  whereTitle: string;
  whereLead: string;
  colA: string;
  iconsA: [string, string][];
  iconsB: [string, string][];
  photos: [file: string, label: string, description?: string, icon?: string][];
  filters: string[];
  faq: { q: string; a?: string; p?: string }[];
}
export const PRICES: Record<ProductId, Record<KitId, number | null>> = {
  f5: { u1: null, u2: null, cx6: null },
  lx: { u1: null, u2: null, cx6: null },
};
export const CHECKOUT: Record<ProductId, Record<KitId, string | null>> = {
  f5: { u1: null, u2: null, cx6: null },
  lx: { u1: null, u2: null, cx6: null },
};
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
// Cada volume tem preço e destino próprios; os valores de 1 L existentes são preservados.
export const PRICES_5L: typeof PRICES = {
  f5: { u1: null, u2: null, cx6: null },
  lx: { u1: null, u2: null, cx6: null },
};
export const CHECKOUT_5L: typeof CHECKOUT = {
  f5: { u1: null, u2: null, cx6: null },
  lx: { u1: null, u2: null, cx6: null },
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
      }));

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
    gallery: ["f5-close", "f5-galao-rotulo", "f5-galao-detalhe"],
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
        pend: "% de remoção do laudo",
        stage: {
          img: "f5-pour",
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
          img: "f5-mop",
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
        pend: "custo por litro diluído",
        stage: {
          img: "f5-counter",
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
          img: "f5-steel",
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
        p: "Você paga direto no checkout seguro e acompanha o envio. Prazo de entrega e garantia aparecem aqui antes da compra.",
        proof: ["Checkout seguro"],
        pend: "prazo e garantia",
        stage: {
          img: "f5-lobby",
          scene: true,
          kind: "steps",
          title: "Do clique à entrega",
          items: [{ b: "Pagamento direto no checkout seguro" }, { b: "Você acompanha o envio" }],
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
      { v: "—%", k: "de remoção de sujidade em teste padronizado", src: "laudo de eficácia" },
      { v: "— m²", k: "limpos com 1 litro diluído", src: "rendimento por litro" },
      { v: "1:—", k: "diluição para limpeza diária", src: "ficha técnica" },
      {
        v: "24",
        k: "meses de validade a partir da fabricação",
        src: "rótulo do produto",
        real: true,
      },
    ],
    study: [
      {
        h: "Teste de remoção de gordura",
        p: "Resultado de bancada comparando a superfície antes e depois de uma aplicação, com o método e o laboratório citados.",
        pin: "Laudo Perol ou laboratório parceiro",
      },
      {
        h: "Compatibilidade com superfícies",
        p: "Lista das superfícies testadas sem manchar ou opacar, e das que pedem cuidado, como alumínio anodizado e couro.",
        pin: "Ficha técnica e FISPQ do produto",
      },
    ],
    ba: [
      {
        t: "Azulejos · galão",
        s: "Comparação ilustrativa",
        before: "f5-comparacao-azulejo-antes",
        after: "f5-comparacao-azulejo-depois",
      },
      {
        t: "Pisos · galão",
        s: "Comparação ilustrativa",
        before: "f5-comparacao-piso-antes",
        after: "f5-comparacao-piso-depois",
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
    filters: ["Todas", "Hotel", "Condomínio", "Restaurante", "Casa", "Empresa de limpeza"],
    faq: [
      {
        q: "Onde posso usar o F5 Flotador?",
        a: "Em superfícies laváveis: pisos frios, cerâmica, porcelanato, azulejos, inox, vidros, fórmica, acrílico, louças e box de banheiro. Teste numa área pequena antes.",
      },
      { q: "Precisa diluir?", p: "diluição recomendada" },
      { q: "Quanto rende 1 litro?", p: "rendimento por litro" },
      {
        q: "Qual a validade?",
        a: "24 meses a partir da data de fabricação, guardado na embalagem original, em local seco e arejado.",
      },
      { q: "Em quantos dias chega?", p: "prazo e regiões" },
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
    gallery: ["lx-pack", "lx-close", "lx-galao-lateral"],
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
        pend: "horas de fixação no teste",
        stage: {
          img: "lx-pour-laundry",
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
          img: "lx-towels",
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
        pend: "dose por kg de roupa",
        stage: {
          img: "lx-front",
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
          img: "lx-machines",
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
        p: "Você paga direto no checkout seguro e acompanha o envio. Prazo de entrega e garantia aparecem aqui antes da compra.",
        proof: ["Checkout seguro"],
        pend: "prazo e garantia",
        stage: {
          img: "lx-spray",
          scene: true,
          kind: "steps",
          title: "Do clique à entrega",
          items: [{ b: "Pagamento direto no checkout seguro" }, { b: "Você acompanha o envio" }],
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
      { v: "— h", k: "de perfume no tecido após a secagem", src: "teste de fixação" },
      { v: "— kg", k: "de roupa perfumados com 1 litro", src: "rendimento por litro" },
      { v: "— ml", k: "por kg de roupa seca", src: "ficha técnica" },
      {
        v: "24",
        k: "meses de validade a partir da fabricação",
        src: "rótulo do produto",
        real: true,
      },
    ],
    study: [
      {
        h: "Teste de fixação da fragrância",
        p: "Avaliação do perfume no tecido em horas e dias após a secagem, com método e amostra descritos.",
        pin: "Laudo Perol ou laboratório parceiro",
      },
      {
        h: "Compatibilidade com tecidos",
        p: "Tecidos testados sem manchar ou alterar a cor, e a forma correta de aplicar em cada processo de lavanderia.",
        pin: "Ficha técnica e FISPQ do produto",
      },
    ],
    ba: [
      { t: "Toalha de hotel", s: "Ao sair da secadora" },
      { t: "Jogo de lençol", s: "Após 7 dias guardado" },
      { t: "Enxoval de pousada", s: "Na arrumação do quarto" },
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
    filters: ["Todas", "Hotel", "Pousada", "Lavanderia", "Casa", "Clínica"],
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
      { q: "Em quantos dias chega?", p: "prazo e regiões" },
      { q: "O perfume dura quanto tempo?", p: "teste de fixação" },
    ],
  },
};
