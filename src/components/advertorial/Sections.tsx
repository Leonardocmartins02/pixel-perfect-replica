import { ArrowUpRight } from "lucide-react";
import type { FlotadorConfig } from "@/content/flotador";
import { formatBRL, isValidCents } from "@/lib/offer";
import { HeroCarousel } from "./HeroCarousel";
import { MediaPlaceholder, Pending } from "./Pending";

type P = { config: FlotadorConfig };

export function DraftBanner({ config }: P) {
  if (config.status !== "draft") return null;
  return <div className="draft-banner">Prévia interna — conteúdo em validação</div>;
}

/** Atalhos do topo do hero; só apontam para seções que existem na página. */
const NAV_LINKS = [
  { href: "#produto", label: "O produto" },
  { href: "#demonstracao", label: "Demonstração" },
  { href: "#oferta", label: "Proposta por caixa" },
  { href: "#perguntas", label: "Dúvidas" },
];

/**
 * Hero no layout da referência: um cartão único com marca e navegação no topo
 * da coluna de texto, título ancorado embaixo e o palco do produto à direita,
 * com o selo de publicidade no lugar dos botões de busca/carrinho.
 */
export function Hero({ config }: P) {
  const { editorial, media, product, offer } = config;
  const price = isValidCents(offer.boxPriceCents) ? formatBRL(offer.boxPriceCents) : null;
  const thumb = media.heroImages[0] ?? null;
  return (
    <section aria-labelledby="titulo" className="hero-section">
      <div className="hero-card">
        <div className="hero-copy">
          <div className="hero-top hero-enter">
            <p className="hero-brand">{product.workingName}</p>
            <nav aria-label="Seções da página">
              <ul className="hero-nav">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="hero-text">
            <h1
              id="titulo"
              className="hero-title hero-enter"
              style={{ ["--enter-delay" as string]: "100ms" }}
            >
              {editorial.h1}
            </h1>
            <p className="hero-lead hero-enter" style={{ ["--enter-delay" as string]: "200ms" }}>
              {editorial.intro}
            </p>
            <div
              className="hero-enter mt-7 flex flex-wrap gap-2.5"
              style={{ ["--enter-delay" as string]: "300ms" }}
            >
              <a href="#oferta" className="link-cta">
                Ver proposta de compra
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
              <a href="#produto" className="link-ghost">
                Conhecer o produto
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            </div>
          </div>
        </div>
        <HeroCarousel images={media.heroImages}>
          <span className="hero-pill hero-ad">Publicidade</span>
          <div className="hero-mini">
            <div className="hero-mini-thumb" aria-hidden="true">
              {thumb ? <img src={thumb.src} alt="" /> : <span className="pending-tag">Foto</span>}
            </div>
            <div className="hero-mini-info">
              <p className="text-sm font-semibold leading-tight">{product.workingName}</p>
              <p className="text-xs text-muted-foreground">Venda por caixa</p>
              {price ? (
                <p className="mt-2 text-sm font-semibold">{price}</p>
              ) : (
                <p className="pending-tag mt-2 text-pending-foreground">Preço pendente</p>
              )}
            </div>
            <a href="#oferta" className="hero-mini-go" aria-label="Ir para a proposta de compra">
              <ArrowUpRight aria-hidden="true" size={20} />
            </a>
          </div>
        </HeroCarousel>
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
