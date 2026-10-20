import { useEffect, useRef, useState } from "react";
import {
  CHECKOUT_RELEASE,
  SKUS,
  checkoutForVolume,
  compareForVolume,
  discountPct,
  DIVS,
  galleryForVolume,
  GUARANTEE_DAYS,
  kitsForVolume,
  PAYMENT,
  type Volume,
  pricesForVolume,
  PRODUCTS,
  SHIPPING,
  flotador,
  type KitId,
  type ProductId,
} from "@/content/flotador";
import { img, money } from "./format";
import { getOfferReadiness, withTracking } from "@/lib/offer";
import {
  Sym,
  OfferCard,
  Objections,
  Mechanism,
  MechSteps,
  SurfaceIcons,
  Stats,
  StudyCards,
  Comparison,
  Reviews,
  SoldProof,
  PlusIcon,
  InfoDialog,
  ShippingInfo,
} from "./sections";
import { Button } from "@/components/ui/button";
import { ApplicationsCarousel } from "./ApplicationsCarousel";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ProductGallery } from "./ProductGallery";
import { ProductSelector, VolumeSelector, KitSelector, ProductFaq } from "./controls";

// Blocos que ganham a entrada no scroll (`.rv`) além dos que já têm a classe no JSX.
const REVEAL_EXTRA = [
  ".pb",
  ".obj-list .oc",
  ".offer-cards > *",
  ".division-list > li",
  ".icons > *",
  ".professional-count",
].join(", ");

export function PerolPage() {
  const reducedMotion = useReducedMotion();
  const [productId, setProductId] = useState<ProductId>("f5");
  const [volume, setVolume] = useState<Volume>(1);
  const kits = kitsForVolume(volume);
  const prices = pricesForVolume(volume);
  const checkout = checkoutForVolume(volume);
  const [kit, setKit] = useState<KitId>("cx6");
  const [toast, setToast] = useState("");
  const [sticky, setSticky] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const product = PRODUCTS[productId];
  // O 5 L não tem caixa com 6: se o kit escolhido não existe no volume, cai no maior disponível.
  const selectedKit = kits.find((item) => item.id === kit) ?? kits[kits.length - 1]!;
  useEffect(() => {
    if (selectedKit.id !== kit) setKit(selectedKit.id);
  }, [selectedKit.id, kit]);
  const price = prices[productId][selectedKit.id];
  const compare = compareForVolume(volume)[productId][selectedKit.id];
  const off = discountPct(price, compare);
  const selectProduct = (id: ProductId) => {
    setProductId(id);
    setToast("");
    history.replaceState(history.state, "", id === "lx" ? "#lavix" : "#flotador");
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };
  const buy = (id: KitId) => {
    setKit(id);
    const approved = CHECKOUT_RELEASE.approved;
    const url = checkout[productId][id];
    const offer = getOfferReadiness({
      ...flotador,
      status: approved ? "approved" : "draft",
      product: {
        ...flotador.product,
        sku: SKUS[volume][productId][id] ?? null,
        volumePerPackage: `${volume} L`,
        unitsPerBox: kits.find((item) => item.id === id)?.n ?? null,
      },
      offer: {
        ...flotador.offer,
        boxPriceCents: prices[productId][id],
        purchaseUrl: url,
        purchaseUrlApproved: approved,
        commercialApproval: approved,
      },
    });
    if (offer.enabled && url) {
      window.location.assign(withTracking(url, window.location.search));
      return;
    }
    setToast("Compra ainda indisponível. Preços e condições deste kit estão pendentes.");
  };
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (!["#lavix", "#lx", "#flotador", "#f5", ""].includes(hash)) return;
      setProductId(["#lavix", "#lx"].includes(hash) ? "lx" : "f5");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const position = () => {
      const hero = page.querySelector("#comprar")?.getBoundingClientRect();
      const offers = page.querySelector("#kits-final")?.getBoundingClientRect();
      const buy = page.querySelector("#comprar [data-buy]")?.getBoundingClientRect();
      if (!hero || !offers) return;
      const offersVisible = offers.top < window.innerHeight && offers.bottom > 0;
      // no mobile a barra aparece desde o início, até o botão "Comprar agora" entrar na tela
      const compact = window.matchMedia("(max-width: 980px)").matches;
      const buyVisible = !!buy && buy.top < window.innerHeight && buy.bottom > 0;
      setSticky(compact ? !buyVisible && !offersVisible : hero.bottom < 0 && !offersVisible);
    };
    position();
    const resize = new ResizeObserver(position);
    resize.observe(page);
    window.addEventListener("scroll", position, { passive: true });
    window.addEventListener("resize", position);
    // cartões e listas entram com o mesmo movimento das seções, um após o outro
    page.querySelectorAll(REVEAL_EXTRA).forEach((el) => el.classList.add("rv"));
    page.querySelectorAll<HTMLElement>(".rv").forEach((el) => {
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children).filter((child) => child.classList.contains("rv"))
        : [];
      const index = Math.max(0, siblings.indexOf(el));
      el.style.setProperty("--rv-delay", `${(index % 6) * 90}ms`);
    });
    const elements = page.querySelectorAll<HTMLElement>(".rv, .ico, .stat");
    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && !reducedMotion) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );
      elements.forEach((el) => {
        el.classList.remove("armed");
        if (el.getBoundingClientRect().top >= window.innerHeight && !el.classList.contains("in"))
          el.classList.add("armed");
        observer!.observe(el);
      });
    } else
      elements.forEach((el) => {
        el.classList.remove("armed");
        el.classList.add("in");
      });
    return () => {
      resize.disconnect();
      observer?.disconnect();
      window.removeEventListener("scroll", position);
      window.removeEventListener("resize", position);
    };
  }, [productId, reducedMotion]);

  return (
    <div className="perol-page" data-prod={productId} ref={pageRef}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="i-check" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".14"></circle>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 12.5l3.2 3.2L17 9"
          ></path>
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14M13 6l6 6-6 6"
          ></path>
        </symbol>
        <symbol id="i-truck" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M2.5 6.5h11v10h-11zM13.5 10h4.2l3.3 3.3v3.2h-7.5z"
          ></path>
          <circle
            cx="6.5"
            cy="17.5"
            r="1.9"
            fill="#fff"
            stroke="currentColor"
            strokeWidth="1.8"
          ></circle>
          <circle
            cx="17.5"
            cy="17.5"
            r="1.9"
            fill="#fff"
            stroke="currentColor"
            strokeWidth="1.8"
          ></circle>
        </symbol>
        <symbol id="i-shield" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M12 2.8l8 3v6.1c0 4.6-3.4 8.1-8 9.3-4.6-1.2-8-4.7-8-9.3V5.8z"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.4 12l2.6 2.6 4.6-5"
          ></path>
        </symbol>
        <symbol id="i-lock" viewBox="0 0 24 24">
          <rect
            x="4.5"
            y="10.5"
            width="15"
            height="10"
            rx="2.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          ></rect>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            d="M8 10.5V8a4 4 0 018 0v2.5"
          ></path>
          <circle cx="12" cy="15.5" r="1.4" fill="currentColor"></circle>
        </symbol>
        <symbol id="i-star" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"
          ></path>
        </symbol>
        <symbol id="i-cam" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            d="M4 8h3.5L9 5.5h6L16.5 8H20v11H4z"
          ></path>
          <circle
            cx="12"
            cy="13.2"
            r="3.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          ></circle>
        </symbol>
        <symbol id="i-q" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M4 5h16v11H9l-5 4z"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M10 9.2a2 2 0 113 1.7c-.7.4-1 .8-1 1.6M12 14.2v.01"
          ></path>
        </symbol>
        <symbol id="i-flask" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M9 3h6M10 3v6L4.8 18.2A1.8 1.8 0 006.4 21h11.2a1.8 1.8 0 001.6-2.8L14 9V3"
          ></path>
          <path fill="currentColor" opacity=".25" d="M7.2 15h9.6l2 3.5H5.2z"></path>
        </symbol>
        <symbol id="i-drop" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M12 3s6 6.6 6 11a6 6 0 01-12 0c0-4.4 6-11 6-11z"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            d="M9.5 14.5a2.5 2.5 0 002.5 2.5"
          ></path>
        </symbol>
        <symbol id="i-cal" viewBox="0 0 24 24">
          <rect
            x="3.5"
            y="5"
            width="17"
            height="15.5"
            rx="2.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          ></rect>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            d="M3.5 10h17M8 3v4M16 3v4"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15l2 2 4-4"
          ></path>
        </symbol>
        <symbol id="i-factory" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            d="M3 20V10l5 3V10l5 3V6h3l1-3h2l1 3v14z"
          ></path>
          <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M7 17h2M12 17h2"></path>
        </symbol>
        <symbol id="i-coin" viewBox="0 0 24 24">
          <ellipse
            cx="12"
            cy="7"
            rx="7"
            ry="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          ></ellipse>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"
          ></path>
        </symbol>
        <symbol id="i-tile" viewBox="0 0 24 24">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          ></rect>
          <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M3 12h18M12 3v18"></path>
        </symbol>
        <symbol id="i-sparkle" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"
          ></path>
        </symbol>
        <symbol id="i-jug" viewBox="0 0 44 52">
          <path
            d="M10 6h8v5h12c4 0 7 3 7 7v28c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4V16c0-3 2-5 5-5z"
            fill="#fff"
            stroke="#BCC7D8"
            strokeWidth="1.4"
          ></path>
          <rect
            x="11"
            y="2"
            width="6"
            height="5"
            rx="1"
            fill="#fff"
            stroke="#BCC7D8"
            strokeWidth="1.2"
          ></rect>
          <path d="M24 15h7c1.6 0 2.5 1 2.5 2.5V21H24z" fill="#E6EBF2"></path>
          <rect x="8" y="25" width="26" height="14" rx="1.5" fill="#fff" stroke="#DCE3EC"></rect>
          <path d="M8 25h8l3 7-3 7H8z" style={{ fill: "var(--acc)" }}></path>
          <rect x="8" y="37" width="26" height="2" fill="#13306B"></rect>
          <rect x="20" y="28" width="11" height="2.2" rx="1" fill="#13306B"></rect>
          <rect x="20" y="32" width="8" height="1.6" rx=".8" fill="#9AA8C2"></rect>
        </symbol>
      </svg>

      <div className="promo" aria-hidden="true">
        <div className="track" id="promo">
          {[...product.promo, ...product.promo, ...product.promo, ...product.promo].map(
            (text, i) => (
              <span key={i}>
                <Sym name="check" />
                {text}
              </span>
            ),
          )}
        </div>
      </div>

      <header className="top">
        <div className="wrap">
          <a className="brand" href="#topo" aria-label="Perol, início">
            <b>Perol</b>
            <small>
              Higiene
              <br />
              profissional
            </small>
          </a>
          <ProductSelector value={productId} onChange={selectProduct} />
          <Button asChild className="btn btn-navy btn-sm">
            <a href="#comprar">Comprar</a>
          </Button>
        </div>
      </header>

      <main id="topo">
        <section className="pdp" id="comprar">
          <div className="wrap pdp-grid">
            <ProductGallery
              key={`${productId}-${volume}`}
              name={product.name}
              gallery={galleryForVolume(product, volume)}
              chip={product.chip1}
            />

            <div className="info swap">
              <h1>
                <span data-k="h1a">{product.h1a}</span>
                <em data-k="h1b">{product.h1b}</em>
              </h1>
              <SoldProof sold={product.sold} />
              {/* rótulo só no mobile, onde a descrição desce para o fim da coluna e perde o título */}
              <span className="eyebrow desc-title">Descrição</span>
              <p className="sub" data-k="sub">
                {product.sub}
              </p>
              <ul className="ticks" id="ticks">
                {product.ticks.map((text) => (
                  <li key={text}>
                    <Sym name="check" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="badges">
                <div className="bdg bdg-iso">
                  <svg viewBox="0 0 48 48">
                    <g className="spin-ring">
                      <circle
                        cx="24"
                        cy="24"
                        r="21"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeDasharray="3 3"
                      ></circle>
                    </g>
                    <circle cx="24" cy="24" r="15" fill="currentColor"></circle>
                    <text
                      x="24"
                      y="22.5"
                      textAnchor="middle"
                      fill="#fff"
                      style={{ font: "800 7px Montserrat,sans-serif" }}
                    >
                      ISO
                    </text>
                    <text
                      x="24"
                      y="31"
                      textAnchor="middle"
                      fill="#fff"
                      style={{ font: "800 8px Montserrat,sans-serif" }}
                    >
                      9001
                    </text>
                  </svg>
                  <div>
                    <b>ISO 9001</b>
                    <span>Fábrica certificada em gestão de qualidade</span>
                  </div>
                </div>
                <div className="bdg">
                  <svg>
                    <use href="#i-cal"></use>
                  </svg>
                  <div>
                    <b>24 meses</b>
                    <span>de validade</span>
                  </div>
                </div>
                <div className="bdg">
                  <svg>
                    <use href="#i-factory"></use>
                  </svg>
                  <div>
                    <b>Linha profissional</b>
                    <span>Higiene Perol</span>
                  </div>
                </div>
              </div>

              <div className="kit-title">
                <b>Escolha seu kit</b>
                {kits.some((item) => prices[productId][item.id] === null) && (
                  <span className="pend">preços</span>
                )}
              </div>
              <VolumeSelector value={volume} onChange={setVolume} />
              <KitSelector volume={volume} value={kit} productId={productId} onChange={setKit} />

              <div className="buyline">
                <div className="total">
                  <span id="kitName">
                    {product.short} · {selectedKit.d}
                  </span>
                  <span className="total-price">
                    {off > 0 && (
                      <span className="was">
                        <s aria-label={`de ${money(compare!)}`}>{money(compare!)}</s>
                        <span className="off">-{off}%</span>
                      </span>
                    )}
                    <b id="totalPrice">{money(price)}</b>
                  </span>
                </div>
                <Button className="btn btn-buy" type="button" data-buy="" onClick={() => buy(kit)}>
                  Comprar agora{" "}
                  <svg>
                    <use href="#i-arrow"></use>
                  </svg>
                </Button>
                <div className="assure">
                  <div>
                    <svg>
                      <use href="#i-truck"></use>
                    </svg>
                    <span>
                      Envio para todo o Brasil · <b>{SHIPPING.paid.days}</b> com seguro
                    </span>
                  </div>
                  <div>
                    <svg>
                      <use href="#i-lock"></use>
                    </svg>
                    <span>Checkout seguro, direto no pagamento</span>
                  </div>
                  <div>
                    <svg>
                      <use href="#i-shield"></use>
                    </svg>
                    <span>
                      Garantia de <b>{GUARANTEE_DAYS} dias</b>
                    </span>
                  </div>
                </div>
                <div className="pay">
                  Pagamento: <i>PIX</i>
                  <i>CARTÃO</i>
                  <span className="pay-hl">
                    <b>{PAYMENT.cardNoInterest}x sem juros</b> no cartão
                  </span>
                  <span className="pay-note">ou até {PAYMENT.cardMax}x com juros</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="proofbar">
          <div className="wrap">
            <div className="pb">
              <svg>
                <use href="#i-shield"></use>
              </svg>
              <div>
                <b>ISO 9001</b>
                <span>Fábrica com gestão de qualidade certificada</span>
              </div>
            </div>
            <div className="pb">
              <svg>
                <use href="#i-factory"></use>
              </svg>
              <div>
                <b>13 divisões</b>
                <span>Hospitalar, alimentícia, aviação, hotelaria e mais</span>
              </div>
            </div>
            <div className="pb">
              <svg>
                <use href="#i-cal"></use>
              </svg>
              <div>
                <b>24 meses</b>
                <span>de validade a partir da fabricação</span>
              </div>
            </div>
            <div className="pb">
              <svg>
                <use href="#i-sparkle"></use>
              </svg>
              <div>
                <b data-k="pb4a">{product.pb4a}</b>
                <span data-k="pb4b">{product.pb4b}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="sec obj" id="duvidas">
          <div className="wrap">
            <div className="sec-head center rv">
              <span className="eyebrow">Antes de comprar</span>
              <h2>Você deve estar se perguntando</h2>
              <p>Role a tela. Cada dúvida comum sobre o produto tem a resposta logo abaixo.</p>
            </div>
            <Objections key={productId} product={product} />
          </div>
        </section>

        <section className="sec offer on-navy" id="kits-final">
          <div className="wrap">
            <div className="sec-head center rv">
              <span className="eyebrow">Escolha seu kit</span>
              <h2>Quanto mais leva, menos paga por litro</h2>
              <p>Toque no kit e vá direto para o pagamento.</p>
            </div>
            <div className="offer-cards" id="offerCards">
              {kits.map((item) => (
                <OfferCard
                  volume={volume}
                  key={item.id}
                  item={item}
                  productId={productId}
                  onBuy={buy}
                />
              ))}
            </div>
            <InfoDialog
              eyebrow="Compra segura"
              title={`Garantia de ${GUARANTEE_DAYS} dias`}
              lead="Prazo de entrega, frete e garantia antes de você comprar."
              trigger={
                <button
                  type="button"
                  className="guar rv"
                  aria-label={`Garantia de ${GUARANTEE_DAYS} dias. Ver prazos, frete e garantia`}
                >
                  <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
                    <g className="spin-ring">
                      <path
                        id="sealPath"
                        fill="none"
                        d="M60 60m-46 0a46 46 0 1092 0a46 46 0 10-92 0"
                      ></path>
                      <text
                        style={{
                          font: "700 8.5px Montserrat,sans-serif",
                          letterSpacing: "1.3px",
                        }}
                        fill="#BFD3FF"
                      >
                        <textPath href="#sealPath">
                          COMPRA SEGURA · SATISFAÇÃO GARANTIDA ·{" "}
                        </textPath>
                      </text>
                    </g>
                    <circle cx="60" cy="60" r="34" fill="#fff"></circle>
                    <text
                      x="60"
                      y="60"
                      textAnchor="middle"
                      fill="#13306B"
                      style={{ font: "800 21px Montserrat,sans-serif" }}
                    >
                      {GUARANTEE_DAYS}
                    </text>
                    <text
                      x="60"
                      y="76"
                      textAnchor="middle"
                      fill="#13306B"
                      style={{ font: "700 10px Montserrat,sans-serif" }}
                    >
                      DIAS
                    </text>
                  </svg>
                  <span style={{ display: "grid", gap: "8px" }}>
                    <span className="guar-h">Garantia de satisfação</span>
                    <span className="guar-p">
                      Se o produto não atender o que promete, você recebe seu dinheiro de volta em
                      até {GUARANTEE_DAYS} dias após o recebimento.
                    </span>
                    <span className="guar-more">
                      Ver prazos, frete e garantia{" "}
                      <span aria-hidden="true">
                        <PlusIcon />
                      </span>
                    </span>
                  </span>
                </button>
              }
            >
              <ShippingInfo />
            </InfoDialog>
          </div>
        </section>

        <section
          className="sec professional-section"
          id="quem-usa"
          aria-labelledby="professional-title"
        >
          <div className="wrap">
            <div className="professional-panel rv">
              <div className="professional-intro">
                <span className="eyebrow">Perol no mercado profissional</span>
                <h2 id="professional-title">
                  Diferentes setores.
                  <br />O mesmo cuidado.
                </h2>
                <p>
                  Conheça as divisões atendidas pela Perol e explore as aplicações de cada produto.
                </p>
                <Button asChild className="professional-link" variant="outline">
                  <a href="#onde-usar">
                    Explorar aplicações <Sym name="arrow" />
                  </a>
                </Button>
                <div className="professional-count">
                  <strong>{DIVS.length.toString().padStart(2, "0")}</strong>
                  <span>
                    divisões do
                    <br />
                    mercado profissional
                  </span>
                </div>
              </div>
              <div className="professional-divisions">
                <div className="professional-label">
                  <span>Áreas de atuação</span>
                  <span>01 — 13</span>
                </div>
                <h3>
                  Uma linha que acompanha
                  <br />
                  diferentes rotinas.
                </h3>
                <ul id="divs" className="division-list" aria-label="Divisões atendidas pela Perol">
                  {DIVS.map((text, index) => (
                    <li key={text}>
                      <span className="division-number" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <small className="professional-source">Fonte: perol.com.br</small>
              </div>
            </div>
          </div>
        </section>

        <section className="sec where" id="onde-usar">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Onde usar</span>
              <h2 data-k="whereTitle">{product.whereTitle}</h2>
              <p data-k="whereLead">{product.whereLead}</p>
            </div>
            <div className="where-grid">
              <div className="where-col rv">
                <h3 data-k="colA">{product.colA}</h3>
                <div className="icons" id="iconsA">
                  <SurfaceIcons items={product.iconsA} />
                </div>
              </div>
              <div className="where-col rv">
                <h3>Locais</h3>
                <div className="icons" id="iconsB">
                  <SurfaceIcons items={product.iconsB} />
                </div>
              </div>
            </div>
            <ApplicationsCarousel
              key={productId}
              product={product}
              onChoose={(nextVolume, nextKit) => {
                setVolume(nextVolume);
                setKit(nextKit);
                // espera o popup fechar antes de rolar até a compra
                window.setTimeout(() => {
                  document.getElementById("comprar")?.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start",
                  });
                }, 120);
              }}
            />
          </div>
        </section>

        <section className="sec" id="antes-depois">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Antes e depois</span>
              <h2>
                {product.ba.some((item) => item.before)
                  ? "Antes e depois nas superfícies"
                  : "Arraste e veja a diferença"}
              </h2>
              <p>
                {product.ba.some((item) => item.before)
                  ? "Comparações ilustrativas do F5 em azulejos e pisos."
                  : "Fotos reais, mesmo lugar, mesma luz e mesmo ângulo. Cada bloco já está pronto para receber o par de fotos."}
              </p>
            </div>
            <div className="ba-grid" id="baGrid">
              {product.ba.map((item) => (
                <Comparison key={item.t} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="como-funciona" style={{ paddingTop: "0" }}>
          <div className="wrap mech-grid">
            <div className="mech-svg rv" id="mechSvg">
              <Mechanism product={product} productId={productId} />
            </div>
            <div>
              <div className="sec-head rv" style={{ marginBottom: "24px" }}>
                <span className="eyebrow">Como funciona</span>
                <h2 data-k="mechTitle">{product.mechTitle}</h2>
                <p data-k="mechLead">{product.mechLead}</p>
              </div>
              <MechSteps steps={product.mech} />
            </div>
          </div>
        </section>

        <section className="sec data on-navy" id="dados">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Ficha técnica</span>
              <h2>Números da ficha, não promessa</h2>
              <p>Dados da ficha técnica oficial Perol. Toque em cada item para ver a explicação.</p>
            </div>
            <div className="stats" id="stats">
              <Stats product={product} />
            </div>
            <div className="study" id="study">
              <StudyCards product={product} />
            </div>
          </div>
        </section>

        <section className="sec" id="avaliacoes">
          <div className="wrap">
            <div className="sec-head rv sold-head">
              <span className="eyebrow">Avaliações</span>
              <h2>
                <span className="sold-n">{product.sold.n}</span> {product.sold.label}{" "}
                {product.sold.where}
              </h2>
              <p>Veja algumas avaliações de quem já comprou.</p>
            </div>
            <div className="reviews" id="reviews">
              <Reviews product={product} />
            </div>
          </div>
        </section>

        <section className="sec faq-section" id="faq">
          <div className="wrap faq-grid">
            <div className="sec-head rv">
              <span className="eyebrow">Dúvidas</span>
              <h2>Perguntas frequentes</h2>
              <p>Sobre o uso, os cuidados e a compra de {product.short}.</p>
              <Button asChild className="btn btn-navy" style={{ justifySelf: "start" }}>
                <a href="#comprar">
                  Escolher meu kit{" "}
                  <svg>
                    <use href="#i-arrow"></use>
                  </svg>
                </a>
              </Button>
            </div>
            <ProductFaq key={productId} product={product} />
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <p>
            Publicidade. Revenda autorizada dos produtos Perol. Esta página não é a loja oficial da
            Perol. Leia atentamente o rótulo antes de usar o produto.
          </p>
          <p>
            Vendedor, CNPJ e atendimento: <span className="pend">dados da empresa vendedora</span>
          </p>
        </div>
      </footer>

      <div className={`sticky-buy ${sticky ? "show" : ""}`} id="stickyBuy" inert={!sticky}>
        <div className="inner">
          <img id="stickyImg" alt="" src={img(galleryForVolume(product, volume)[0]!)} />
          <div className="t">
            <b id="stickyName">
              {product.short} · {selectedKit.d}
            </b>
            <span id="stickyPrice">
              {price === null ? (
                "Preço a definir"
              ) : (
                <>
                  {off > 0 && (
                    <span className="sp-was">
                      <s>{money(compare!)}</s>
                      <span className="off">-{off}%</span>
                    </span>
                  )}
                  <strong className="sp-final">{money(price)}</strong>
                </>
              )}
            </span>
          </div>
          <Button
            className="btn btn-navy btn-sm"
            type="button"
            data-buy=""
            onClick={() => buy(kit)}
          >
            Comprar agora
          </Button>
        </div>
      </div>
      <div className={`toast ${toast ? "show" : ""}`} id="toast" role="status">
        {toast}
      </div>
    </div>
  );
}
