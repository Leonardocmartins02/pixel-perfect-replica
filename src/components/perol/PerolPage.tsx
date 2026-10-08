import { useEffect, useRef, useState, type TouchEvent } from "react";
import {
  CHECKOUT,
  DIVS,
  KITS,
  PRICES,
  PRODUCTS,
  flotador,
  type KitId,
  type ProductId,
} from "@/content/flotador";
import { img, money } from "./format";
import { getOfferReadiness } from "@/lib/offer";
import {
  Sym,
  Pending,
  OfferCard,
  Objections,
  Mechanism,
  SurfaceIcons,
  Stats,
  Comparison,
  Reviews,
} from "./sections";
import { Button } from "@/components/ui/button";
import { ProductSelector, KitSelector, ProductFaq, ReviewFilter } from "./controls";

export function PerolPage() {
  const [productId, setProductId] = useState<ProductId>("f5");
  const [kit, setKit] = useState<KitId>("cx6");
  const [imageIndex, setImageIndex] = useState(0);
  const [filter, setFilter] = useState("Todas");
  const [toast, setToast] = useState("");
  const [sticky, setSticky] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);
  const product = PRODUCTS[productId];
  const selectedKit = KITS.find((item) => item.id === kit)!;
  const selectProduct = (id: ProductId) => {
    setProductId(id);
    setImageIndex(0);
    setFilter("Todas");
    setToast("");
    history.replaceState(history.state, "", id === "lx" ? "#lavix" : "#flotador");
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };
  const swipe = (event: TouchEvent<HTMLDivElement>) => {
    const end = event.changedTouches[0]?.clientX;
    const start = touchStart.current;
    if (start !== null && end !== undefined && Math.abs(end - start) > 40) {
      const direction = end < start ? 1 : -1;
      setImageIndex(
        (index) => (index + direction + product.gallery.length) % product.gallery.length,
      );
    }
    touchStart.current = null;
  };
  const buy = (id: KitId) => {
    setKit(id);
    const offer = getOfferReadiness({
      ...flotador,
      offer: {
        ...flotador.offer,
        boxPriceCents: PRICES[productId][id],
        purchaseUrl: CHECKOUT[productId][id],
      },
    });
    if (offer.enabled && CHECKOUT[productId][id]) {
      window.location.assign(CHECKOUT[productId][id]!);
      return;
    }
    setToast("Compra ainda indisponível. Preços e condições deste kit estão pendentes.");
  };
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      if (!["#lavix", "#lx", "#flotador", "#f5", ""].includes(hash)) return;
      setProductId(["#lavix", "#lx"].includes(hash) ? "lx" : "f5");
      setImageIndex(0);
      setFilter("Todas");
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
      if (hero && offers)
        setSticky(hero.bottom < 0 && !(offers.top < window.innerHeight && offers.bottom > 0));
    };
    position();
    const resize = new ResizeObserver(position);
    resize.observe(page);
    window.addEventListener("scroll", position, { passive: true });
    window.addEventListener("resize", position);
    const elements = page.querySelectorAll<HTMLElement>(".rv, .ico, .stat");
    let observer: IntersectionObserver | undefined;
    if (
      "IntersectionObserver" in window &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer?.unobserve(entry.target);
            }
          }),
        { threshold: 0.12 },
      );
      elements.forEach((el) => {
        el.classList.remove("armed", "in");
        if (el.getBoundingClientRect().top >= window.innerHeight) el.classList.add("armed");
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
  }, [productId, filter]);

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

      <div className="draft">
        Modelo de referência · preços, laudos, depoimentos e logos marcados como <b>A DEFINIR</b>{" "}
        entram com dados reais
      </div>
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
            <div className="gallery">
              <div className="thumbs" id="thumbs">
                {product.gallery.map((name, i) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-auto w-full"
                    key={name}
                    type="button"
                    aria-label={`Ver foto ${i + 1}`}
                    aria-current={imageIndex === i ? "true" : "false"}
                    onClick={() => setImageIndex(i)}
                  >
                    <img src={img(name)} alt="" loading="lazy" />
                  </Button>
                ))}
              </div>
              <div
                className="main-img"
                id="mainImg"
                onTouchStart={(event) => {
                  touchStart.current = event.touches[0]?.clientX ?? null;
                }}
                onTouchEnd={swipe}
              >
                {product.gallery.map((name, i) => (
                  <img
                    key={name}
                    src={img(name)}
                    alt={`${product.name}, foto ${i + 1}`}
                    className={imageIndex === i ? "on" : ""}
                    loading={i ? "lazy" : "eager"}
                  />
                ))}
                <div className="tag">
                  <span className="chip" data-k="chip1">
                    {product.chip1}
                  </span>
                  <span className="chip light">ISO 9001</span>
                </div>
                <span className="count" id="imgCount">
                  {imageIndex + 1} / {product.gallery.length}
                </span>
              </div>
            </div>

            <div className="info swap">
              <div className="rating-row">
                <span className="stars empty">
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                </span>
                <span>–,– · avaliações reais</span>
                <span className="pend">nota e nº de avaliações</span>
              </div>
              <h1>
                <span data-k="h1a">{product.h1a}</span>
                <em data-k="h1b">{product.h1b}</em>
              </h1>
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
                <div className="bdg">
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
                      style={{ font: "800 7px Figtree,sans-serif" }}
                    >
                      ISO
                    </text>
                    <text
                      x="24"
                      y="31"
                      textAnchor="middle"
                      fill="#fff"
                      style={{ font: "800 8px Figtree,sans-serif" }}
                    >
                      9001
                    </text>
                  </svg>
                  <div>
                    <b>Fábrica certificada</b>
                    <span>Gestão de qualidade</span>
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
                <span className="pend">preços</span>
              </div>
              <KitSelector value={kit} productId={productId} onChange={setKit} />

              <div className="buyline">
                <div className="total">
                  <span id="kitName">
                    {product.short} · {selectedKit.d}
                  </span>
                  <b id="totalPrice">{money(PRICES[productId][kit])}</b>
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
                      Envio para todo o Brasil <span className="pend">prazo</span>
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
                      Garantia <span className="pend">dias</span>
                    </span>
                  </div>
                </div>
                <div className="pay">
                  Pagamento: <i>PIX</i>
                  <i>CARTÃO</i>
                  <i>BOLETO</i>
                  <span className="pend">confirmar meios</span>
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
              <ol className="mech-steps rv" id="mechSteps">
                {product.mech.map((step) => (
                  <li key={step.b}>
                    <div>
                      <b>{step.b}</b>
                      <p>{step.p}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="sec data on-navy" id="dados">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Dados de eficácia</span>
              <h2>Números do laudo, não promessa</h2>
              <p>
                Os medidores enchem com o resultado de cada teste. Os números entram a partir do
                laudo técnico ou da ficha do produto Perol.
              </p>
            </div>
            <div className="stats" id="stats">
              <Stats product={product} />
            </div>
            <div className="study" id="study">
              {product.study.map((study) => (
                <article className="rv" key={study.h}>
                  <span className="eyebrow">Estudo</span>
                  <h3>{study.h}</h3>
                  <p>{study.p}</p>
                  <span className="pin">
                    <Sym name="flask" />
                    {study.pin}
                  </span>
                  <Pending>documento técnico</Pending>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="antes-depois">
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Antes e depois</span>
              <h2>Arraste e veja a diferença</h2>
              <p>
                Fotos reais, mesmo lugar, mesma luz e mesmo ângulo. Cada bloco já está pronto para
                receber o par de fotos.
              </p>
            </div>
            <div className="ba-grid" id="baGrid">
              {product.ba.map((item) => (
                <Comparison key={item.t} item={item} />
              ))}
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
            <div className="photo-row" id="photoRow">
              {product.photos.map(([name, label]) => (
                <figure className="rv" key={name}>
                  <img src={img(name)} alt={label} loading="lazy" />
                  <figcaption>{label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="quem-usa">
          <div className="wrap">
            <div className="sec-head center rv">
              <span className="eyebrow">Quem usa Perol</span>
              <h2>Empresas que confiam na marca</h2>
              <p>
                Só entram logos de clientes reais, com autorização para uso. Hotéis, hospitais,
                condomínios e restaurantes que já compram Perol.
              </p>
            </div>
            <div className="logos rv" id="logos">
              {["Hotel", "Hospital", "Condomínio", "Restaurante", "Escola", "Indústria"].map(
                (label) => (
                  <div key={label}>
                    Logo real
                    <br />
                    {label}
                  </div>
                ),
              )}
            </div>
            <div className="divs rv">
              <p>A Perol atende 13 divisões do mercado profissional</p>
              <ul id="divs">
                {DIVS.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              <small>Fonte: perol.com.br</small>
            </div>
          </div>
        </section>

        <section className="sec" id="avaliacoes" style={{ paddingTop: "0" }}>
          <div className="wrap">
            <div className="sec-head rv">
              <span className="eyebrow">Avaliações</span>
              <h2>O que dizem os clientes</h2>
            </div>
            <div className="rev-head rv">
              <span className="big">–,–</span>
              <div style={{ display: "grid", gap: "6px", justifyItems: "start" }}>
                <span className="stars empty">
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                  <svg>
                    <use href="#i-star"></use>
                  </svg>
                </span>
                <span className="pend">média e total de avaliações reais</span>
              </div>
            </div>
            <ReviewFilter items={product.filters} value={filter} onChange={setFilter} />
            <div className="reviews" id="reviews">
              <Reviews product={product} filter={filter} />
            </div>
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
              {KITS.map((item) => (
                <OfferCard key={item.id} item={item} productId={productId} onBuy={buy} />
              ))}
            </div>
            <div className="guar rv">
              <svg className="seal" viewBox="0 0 120 120" aria-hidden="true">
                <g className="spin-ring">
                  <path
                    id="sealPath"
                    fill="none"
                    d="M60 60m-46 0a46 46 0 1092 0a46 46 0 10-92 0"
                  ></path>
                  <text
                    style={{ font: "700 9.5px 'IBM Plex Mono',monospace", letterSpacing: "2px" }}
                    fill="#BFD3FF"
                  >
                    <textPath href="#sealPath">COMPRA SEGURA · SATISFAÇÃO GARANTIDA · </textPath>
                  </text>
                </g>
                <circle cx="60" cy="60" r="34" fill="#fff"></circle>
                <text
                  x="60"
                  y="60"
                  textAnchor="middle"
                  fill="#13306B"
                  style={{ font: "900 24px Archivo,sans-serif" }}
                >
                  —
                </text>
                <text
                  x="60"
                  y="76"
                  textAnchor="middle"
                  fill="#13306B"
                  style={{ font: "700 10px Figtree,sans-serif" }}
                >
                  DIAS
                </text>
              </svg>
              <div style={{ display: "grid", gap: "8px" }}>
                <h3>Garantia de satisfação</h3>
                <p>
                  Se o produto não atender o que promete, você recebe seu dinheiro de volta. Prazo e
                  condições definidos pela operação.
                </p>
                <span className="pend">prazo e regras da garantia</span>
              </div>
            </div>
          </div>
        </section>

        <section className="sec" id="faq">
          <div className="wrap faq-grid">
            <div className="sec-head rv">
              <span className="eyebrow">Dúvidas</span>
              <h2>Perguntas frequentes</h2>
              <p>Respostas tiradas do rótulo. As pendentes dependem da operação.</p>
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
          <img id="stickyImg" alt="" src={img(product.gallery[0]!)} />
          <div className="t">
            <b id="stickyName">
              {product.short} · {selectedKit.d}
            </b>
            <span id="stickyPrice">
              {PRICES[productId][kit] === null ? "Preço a definir" : money(PRICES[productId][kit])}
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
