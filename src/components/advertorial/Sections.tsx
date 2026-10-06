import type { FlotadorConfig } from "@/content/flotador";
import { formatBRL, isValidCents } from "@/lib/offer";
import { MediaPlaceholder, Pending } from "./Pending";

type P = { config: FlotadorConfig };

export function DraftBanner({ config }: P) {
  if (config.status !== "draft") return null;
  return <div className="draft-banner">Prévia interna — conteúdo em validação</div>;
}

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="container-hero flex items-center justify-between gap-4 py-4">
        <span className="font-display text-lg font-semibold">
          Flotador Perol · proposta por caixa
        </span>
        <span className="ad-label">Publicidade</span>
      </div>
    </header>
  );
}

/** Partículas decorativas do palco do hero (posição, tamanho em px e defasagem da animação). */
const FLOATERS = [
  { left: "8%", top: "14%", size: 14, delay: "0s" },
  { left: "82%", top: "10%", size: 22, delay: "-2s" },
  { left: "90%", top: "46%", size: 10, delay: "-4s" },
  { left: "12%", top: "60%", size: 18, delay: "-1s" },
  { left: "70%", top: "78%", size: 12, delay: "-3s" },
  { left: "30%", top: "88%", size: 16, delay: "-5s" },
];

export function Hero({ config }: P) {
  const { editorial, media, product, offer } = config;
  const price = isValidCents(offer.boxPriceCents) ? formatBRL(offer.boxPriceCents) : null;
  return (
    <section aria-labelledby="titulo" className="section pt-6 md:pt-10">
      <div className="container-hero">
        <div className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Conteúdo publicitário</p>
            <h1 id="titulo" className="display-title">
              {editorial.h1}
            </h1>
            <p className="lead mt-5">{editorial.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#oferta" className="link-cta">
                Ver proposta de compra
              </a>
              <a href="#produto" className="link-ghost">
                Conhecer o produto
              </a>
            </div>
          </div>
          <div className="hero-stage">
            <div aria-hidden="true" className="hero-floaters">
              {FLOATERS.map((f) => (
                <span
                  key={f.left + f.top}
                  className="hero-floater"
                  style={{
                    left: f.left,
                    top: f.top,
                    width: f.size,
                    height: f.size,
                    animationDelay: f.delay,
                  }}
                />
              ))}
            </div>
            <div className="hero-product">
              {media.heroImage ? (
                <img
                  src={media.heroImage.src}
                  alt={media.heroImage.alt}
                  className="hero-product-img"
                />
              ) : (
                <MediaPlaceholder
                  label="Imagem real e autorizada do Flotador Perol"
                  ratio="4 / 3"
                />
              )}
            </div>
            <div className="hero-mini">
              <div>
                <p className="text-sm font-semibold">{product.workingName}</p>
                <p className="text-xs text-muted-foreground">Venda por caixa</p>
              </div>
              {price ? (
                <p className="text-sm font-semibold">{price}</p>
              ) : (
                <p className="pending-tag text-pending-foreground">Preço pendente</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BuyerContext({ config }: P) {
  return (
    <section id="contexto" aria-labelledby="contexto-t" className="section">
      <div className="container-read">
        <h2 id="contexto-t" className="section-title">
          Para quem é e qual necessidade atende
        </h2>
        {config.editorial.buyerProblem ? (
          <p className="prose-body">{config.editorial.buyerProblem}</p>
        ) : (
          <Pending>
            Público principal e problema central do comprador — aguardando briefing do parceiro.
          </Pending>
        )}
      </div>
    </section>
  );
}

function List({ title, items, pending }: { title: string; items: string[]; pending: string }) {
  return (
    <div className="mt-8">
      <h3 className="sub-title">{title}</h3>
      {items.length ? (
        <ul className="mt-3 list-disc space-y-2 pl-5 prose-body">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : (
        <Pending>{pending}</Pending>
      )}
    </div>
  );
}

export function ProductSection({ config }: P) {
  const { product, editorial } = config;
  return (
    <section id="produto" aria-labelledby="produto-t" className="section">
      <div className="container-read">
        <h2 id="produto-t" className="section-title">
          O produto
        </h2>
        {editorial.productExplanation ? (
          <p className="prose-body">{editorial.productExplanation}</p>
        ) : (
          <Pending>
            Explicação do produto e de sua aplicação — aguardando conteúdo técnico aprovado.
          </Pending>
        )}
        <List title="Aplicações" items={product.applications} pending="Aplicações aprovadas." />
        <List title="Benefícios" items={product.benefits} pending="Benefícios aprovados." />
        <List
          title="Como usar"
          items={product.usageInstructions}
          pending="Instruções de uso aprovadas."
        />
        <List
          title="Cuidados e restrições"
          items={product.restrictions}
          pending="Restrições e cuidados aprovados."
        />
      </div>
    </section>
  );
}

export function Demonstration({ config }: P) {
  const demo = config.media.demonstration;
  return (
    <section id="demonstracao" aria-labelledby="demo-t" className="section section-tint">
      <div className="container-wide">
        <h2 id="demo-t" className="section-title">
          Demonstração
        </h2>
        {demo?.kind === "video" ? (
          <video
            controls
            preload="metadata"
            poster={demo.poster}
            className="w-full rounded-lg"
            style={{ aspectRatio: "16 / 9" }}
          >
            <source src={demo.src} />
          </video>
        ) : demo ? (
          <img
            src={demo.src}
            alt={demo.alt}
            className="w-full rounded-lg"
            style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
          />
        ) : (
          <MediaPlaceholder
            label="Foto ou vídeo real e autorizado de demonstração"
            ratio="16 / 9"
          />
        )}
      </div>
    </section>
  );
}
