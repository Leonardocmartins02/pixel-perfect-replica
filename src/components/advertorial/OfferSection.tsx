import type { FlotadorConfig } from "@/content/flotador";
import { formatBRL, getOfferReadiness, isValidCents, unitPriceCents } from "@/lib/offer";
import { Pending } from "./Pending";

export function OfferSection({ config }: { config: FlotadorConfig }) {
  const { product, offer } = config;
  const readiness = getOfferReadiness(config);
  const unit = unitPriceCents(offer.boxPriceCents, product.unitsPerBox);

  return (
    <section id="oferta" aria-labelledby="oferta-t" className="section" tabIndex={-1}>
      <div className="container-read">
        <div className="offer-panel">
          <p className="eyebrow">Proposta de compra</p>
          <h2 id="oferta-t" className="section-title mt-1">
            Caixa de {product.workingName}
          </h2>

          <dl className="offer-specs">
            <div>
              <dt>Produto</dt>
              <dd>
                {product.sku ?? <span className="text-muted-foreground">Versão/SKU pendente</span>}
              </dd>
            </div>
            <div>
              <dt>Volume por embalagem</dt>
              <dd>
                {product.volumePerPackage ?? (
                  <span className="text-muted-foreground">Pendente</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Unidades por caixa</dt>
              <dd>
                {product.unitsPerBox ?? <span className="text-muted-foreground">Pendente</span>}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground">Preço total da caixa</p>
            {isValidCents(offer.boxPriceCents) ? (
              <p className="price" data-testid="box-price">
                {formatBRL(offer.boxPriceCents)}
              </p>
            ) : (
              <p className="price-pending" data-testid="box-price">
                Preço a definir
              </p>
            )}
            {unit !== null && (
              <p className="mt-1 text-sm text-muted-foreground">
                Equivale a {formatBRL(unit)} por unidade
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="sub-title">Entrega</h3>
            {offer.deliveryConditions ? (
              <p className="prose-body">{offer.deliveryConditions}</p>
            ) : (
              <Pending>Condições, abrangência e prazos de entrega.</Pending>
            )}
          </div>

          <div className="mt-8">
            {readiness.enabled && offer.purchaseUrl ? (
              <a href={offer.purchaseUrl} className="link-cta" rel="noopener">
                Comprar caixa
              </a>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="cta-disabled"
                  aria-describedby="oferta-status"
                >
                  Compra ainda não liberada
                </button>
                <p id="oferta-status" className="mt-3 text-sm text-muted-foreground">
                  A oferta será liberada após validação de: {readiness.missing.join("; ")}.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
