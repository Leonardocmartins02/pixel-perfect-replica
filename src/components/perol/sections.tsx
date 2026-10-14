import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  compareForVolume,
  discountPct,
  GUARANTEE_DAYS,
  PAYMENT,
  pricesForVolume,
  SHIPPING,
  type Volume,
  type KitId,
  type PerolKit,
  type ProductContent,
  type ProductId,
  type SoldProof as SoldProofData,
} from "@/content/flotador";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { img, money } from "./format";
import { ICONS, mechanismSvg } from "./illustrations";

export function Sym({ name }: { name: string }) {
  return (
    <svg aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
export function Pending({ children }: { children: ReactNode }) {
  return <span className="pend">{children}</span>;
}
/** Selo verde com um fato de apoio já confirmado (rótulo, ficha ou preço). */
export function Fact({ children }: { children: ReactNode }) {
  return (
    <span className="fact">
      <Sym name="check" />
      <span>{children}</span>
    </span>
  );
}
/** "+" desenhado em SVG, para ficar centralizado no círculo em qualquer fonte. */
export function PlusIcon() {
  return (
    <svg className="plus-ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}
/** Cinco estrelas; sem nota ficam vazias, e as que passam da nota ficam apagadas. */
export function Stars({
  score,
  className = "",
}: {
  score?: number | undefined;
  className?: string;
}) {
  return (
    <span className={`stars ${score ? "" : "empty"} ${className}`.trim()}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={score && n > Math.round(score) ? "off" : ""} aria-hidden="true">
          <use href="#i-star" />
        </svg>
      ))}
    </span>
  );
}
/** Volume vendido com o caminhão animado (o movimento para com redução de movimento, no CSS). */
export function SoldProof({ sold }: { sold: SoldProofData }) {
  return (
    <div className="sold-proof">
      <span className="sold-ico" aria-hidden="true">
        <svg viewBox="0 0 76 48">
          <path className="sold-road" d="M2 43h72" />
          <g className="sold-speed">
            <path d="M3 17h7" />
            <path d="M1 23h9" />
            <path d="M4 29h6" />
          </g>
          <g className="sold-truck">
            <rect className="sold-box" x="13" y="11" width="31" height="23" rx="3" />
            <path className="sold-check" d="M22 22.5l4 4 8-8" />
            <path
              className="sold-cab"
              d="M44 17h10.5a3 3 0 0 1 2.4 1.2l5.4 7.2a3 3 0 0 1 .7 1.9V34H44z"
            />
            <path className="sold-win" d="M47 20h7l4 5.5H47z" />
            <g className="sold-wheel" style={{ transformOrigin: "23px 36px" }}>
              <circle cx="23" cy="36" r="5" />
              <path d="M23 32.5v7M19.5 36h7" />
            </g>
            <g className="sold-wheel" style={{ transformOrigin: "53px 36px" }}>
              <circle cx="53" cy="36" r="5" />
              <path d="M53 32.5v7M49.5 36h7" />
            </g>
          </g>
          <g className="sold-pin">
            <circle className="sold-pulse" cx="68" cy="13" r="5" />
            <path d="M68 3.5a6 6 0 0 1 6 6c0 4.5-6 10.5-6 10.5s-6-6-6-10.5a6 6 0 0 1 6-6z" />
            <circle className="sold-dot" cx="68" cy="9.5" r="2.1" />
          </g>
        </svg>
      </span>
      <span className="sold-text">
        <b>
          {sold.n} {sold.label}
        </b>
        <span>Entrega rastreável para todo o Brasil</span>
      </span>
    </div>
  );
}
/** Popup padrão da página (Dialog do shadcn): rótulo, título, texto de apoio e o conteúdo. */
export function InfoDialog({
  trigger,
  eyebrow,
  title,
  lead,
  children,
  onOpenChange,
}: {
  trigger: ReactNode;
  eyebrow: string;
  title: string;
  lead?: string | undefined;
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog {...(onOpenChange ? { onOpenChange } : {})}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="perol-dialog" overlayClassName="perol-dialog-overlay">
        <span className="pd-eyebrow">{eyebrow}</span>
        <DialogTitle className="pd-title">{title}</DialogTitle>
        {lead ? (
          <DialogDescription className="pd-lead">{lead}</DialogDescription>
        ) : (
          <DialogDescription className="sr-only">{title}</DialogDescription>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}
/** Prazos de entrega, garantia e pagamento (conteúdo do popup "Compra segura"). */
export function ShippingInfo() {
  return (
    <dl className="pd-list">
      <div>
        <dt>{SHIPPING.paid.label}</dt>
        <dd>
          <b>{SHIPPING.paid.days}</b>
        </dd>
      </div>
      <div>
        <dt>{SHIPPING.free.label}</dt>
        <dd>
          <b>{SHIPPING.free.days}</b>
        </dd>
      </div>
      <div>
        <dt>Garantia</dt>
        <dd>
          <b>{GUARANTEE_DAYS} dias</b> após o recebimento. Se o produto não atender, você recebe seu
          dinheiro de volta.
        </dd>
      </div>
      <div>
        <dt>Pagamento</dt>
        <dd>
          PIX ou cartão em até <b>{PAYMENT.cardNoInterest}x sem juros</b> (até {PAYMENT.cardMax}x
          com juros)
        </dd>
      </div>
    </dl>
  );
}
function Jugs({ count }: { count: number }) {
  return (
    <span className="jugs">
      {Array.from({ length: count }, (_, i) => (
        <Sym key={i} name="jug" />
      ))}
    </span>
  );
}
export function KitOption({
  item,
  productId,
  volume = 1,
}: {
  item: PerolKit;
  productId: ProductId;
  volume?: Volume;
}) {
  const price = pricesForVolume(volume)[productId][item.id];
  const compare = compareForVolume(volume)[productId][item.id];
  const off = discountPct(price, compare);
  return (
    <RadioGroupItem className="kit" value={item.id}>
      {item.flag && <span className={`flag ${item.navy ? "navy" : ""}`}>{item.flag}</span>}
      <Jugs count={item.n} />
      <span className="q">{item.q}</span>
      <span className="d">{item.d}</span>
      {/* sem desconto o espaço continua reservado, para os preços dos kits ficarem alinhados */}
      {off > 0 ? (
        <span className="was">
          <s aria-label={`de ${money(compare!)}`}>{money(compare!)}</s>
          <span className="off">-{off}%</span>
        </span>
      ) : (
        <span className="was" aria-hidden="true" />
      )}
      <span className="pr">{money(price)}</span>
      <span className="pl">
        {price === null ? "R$ ––/L" : `${money(Math.round(price / (item.n * volume)))}/L`}
      </span>
    </RadioGroupItem>
  );
}
export function OfferCard({
  item,
  productId,
  volume = 1,
  onBuy,
}: {
  item: PerolKit;
  productId: ProductId;
  volume?: Volume;
  onBuy: (id: KitId) => void;
}) {
  const price = pricesForVolume(volume)[productId][item.id];
  const compare = compareForVolume(volume)[productId][item.id];
  const off = discountPct(price, compare);
  return (
    <article className={`oc2 rv ${item.flag === "Melhor custo" ? "hl" : ""}`}>
      {item.flag && <span className="flag">{item.flag}</span>}
      <Jugs count={item.n} />
      <h3>{item.title}</h3>
      <span className="d">{item.d}</span>
      {off > 0 && (
        <span className="was">
          <s aria-label={`de ${money(compare!)}`}>{money(compare!)}</s>
          <span className="off">-{off}% OFF</span>
        </span>
      )}
      <span className="pr">{money(price)}</span>
      <span className="pl">
        {price === null
          ? "R$ ––/L · preço a definir"
          : `${money(Math.round(price / (item.n * volume)))} por litro`}
      </span>
      <ul>
        {item.perks.map((text) => (
          <li key={text}>
            <Sym name="check" />
            {text}
          </li>
        ))}
      </ul>
      <Button className="btn btn-navy" type="button" onClick={() => onBuy(item.id)}>
        Comprar {item.title.toLowerCase()} <Sym name="arrow" />
      </Button>
    </article>
  );
}
// Abaixo disso o palco deixa de ser sticky e passa para dentro de cada cartão (sem sobreposição).
const STACK_QUERY = "(max-width: 980px)";

function useStacked() {
  const [stacked, setStacked] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(STACK_QUERY);
    const sync = () => setStacked(query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);
  return stacked;
}

/** Palco da objeção: foto do produto + o que ela demonstra (passos, itens ou ficha). */
export function ProductStage({
  product,
  index,
  className = "",
}: {
  product: ProductContent;
  index: number;
  className?: string;
}) {
  const { stage } = product.obj[index]!;
  return (
    <div className={`stage ${className}`} data-kind={stage.kind}>
      <figure className={`stage-photo ${stage.scene ? "scene" : ""}`}>
        <img
          src={img(stage.img)}
          alt={`${product.name}, ${stage.title}`}
          loading={index ? "lazy" : "eager"}
          decoding="async"
        />
      </figure>
      <div className="stage-body">
        <span className="stage-step">
          Dúvida {index + 1} de {product.obj.length}
        </span>
        <h4>{stage.title}</h4>
        {stage.kind === "steps" && (
          <ol className="stage-steps">
            {stage.items.map((item) => (
              <li key={item.b}>{item.b}</li>
            ))}
          </ol>
        )}
        {stage.kind === "tags" && (
          <ul className="stage-tags">
            {stage.items.map((item) => (
              <li key={item.b}>{item.b}</li>
            ))}
          </ul>
        )}
        {stage.kind === "spec" && (
          <dl className="stage-spec">
            {stage.items.map((item) => (
              <div key={item.b}>
                <dt>{item.b}</dt>
                {item.s && <dd>{item.s}</dd>}
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}

export function Objections({ product }: { product: ProductContent }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const stacked = useStacked();
  useEffect(() => {
    if (stacked || !list.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset["index"]));
        }),
      { rootMargin: "-42% 0px -42% 0px" },
    );
    list.current.querySelectorAll("article").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stacked]);
  return (
    <div className="obj-grid">
      {!stacked && (
        <div className="obj-stage-wrap">
          {/* key = remonta o palco a cada dúvida e reinicia a animação de entrada */}
          <ProductStage key={active} product={product} index={active} className="enter" />
        </div>
      )}
      <div className="obj-list" ref={list}>
        {product.obj.map((item, i) => (
          <article
            key={item.q}
            className={`oc ${stacked || active === i ? "on" : ""}`}
            data-index={i}
          >
            {stacked && <ProductStage product={product} index={i} />}
            <span className="q">
              <Sym name="q" />“{item.q}”
            </span>
            <h3>{item.h}</h3>
            <p>{item.p}</p>
            {item.fact && (
              <div className="proof">
                <Fact>{item.fact}</Fact>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
// SVG markup is local illustration code from the supplied reference, never user input.
export function Mechanism({
  product,
  productId,
}: {
  product: ProductContent;
  productId: ProductId;
}) {
  return <div dangerouslySetInnerHTML={{ __html: mechanismSvg(product, productId) }} />;
}
export function SurfaceIcons({ items }: { items: [string, string][] }) {
  return (
    <>
      {items.map(([name, label]) => (
        <div className="ico" key={name}>
          <span dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }} />
          {label}
        </div>
      ))}
    </>
  );
}
// Painel de dados: o dado `hero` ganha o número grande; os demais confirmados viram cartões que abrem
// a explicação num popup; o que depende de laudo/ficha continua como campo vazio marcado Pendente.
export function Stats({ product }: { product: ProductContent }) {
  const confirmed = product.stats.filter((item) => item.real);
  const hero = confirmed.filter((item) => item.hero);
  const specs = confirmed.filter((item) => !item.hero);
  const waiting = product.stats.filter((item) => !item.real);
  return (
    <>
      <div className="dados-sum">
        <p>
          <b>{confirmed.length}</b> de {product.stats.length} dados confirmados
        </p>
        <div className="dados-seg" aria-hidden="true">
          {product.stats.map((item) => (
            <span key={item.k} className={item.real ? "on" : ""} />
          ))}
        </div>
      </div>
      <div className="stats-real">
        {hero.map((item) => (
          <div className="stat real rv" key={item.k}>
            <b className="v">{item.v}</b>
            <span className="k">{item.k}</span>
            <span className="src">Fonte: {item.src}</span>
          </div>
        ))}
      </div>
      <ul className="stats-wait">
        {specs.map((item) => (
          <li className="stat spec rv" key={item.k}>
            <InfoDialog
              eyebrow={`Fonte: ${item.src}`}
              title={`${item.v} · ${item.k}`}
              lead={item.info}
              trigger={
                <button
                  type="button"
                  className="spec-btn"
                  aria-label={`${item.v} ${item.sub ?? ""} ${item.k}. Ver detalhes`}
                >
                  <span className="v">
                    {item.v}
                    {item.sub && <small>{item.sub}</small>}
                  </span>
                  <span className="k">{item.k}</span>
                  <span className="spec-src">
                    <Sym name="flask" />
                    {item.src}
                    <span className="spec-more" aria-hidden="true">
                      <PlusIcon />
                    </span>
                  </span>
                </button>
              }
            />
          </li>
        ))}
        {waiting.map((item) => (
          <li className="stat wait rv" key={item.k}>
            <span className="v" aria-label="valor pendente">
              {item.v}
            </span>
            <span className="k">{item.k}</span>
            <Pending>{item.src}</Pending>
          </li>
        ))}
      </ul>
    </>
  );
}
/** Cartões da ficha técnica: cada um abre a tabela completa (`details`) num popup. */
export function StudyCards({ product }: { product: ProductContent }) {
  return (
    <>
      {product.study.map((study) => (
        <InfoDialog
          key={study.h}
          eyebrow={`${study.tag} · ${product.name}`}
          title={study.h}
          lead={study.p}
          trigger={
            <button type="button" className="study-card rv">
              <span className="eyebrow">{study.tag}</span>
              <h3>{study.h}</h3>
              <p>{study.p}</p>
              <span className="pin">
                <Sym name="flask" />
                {study.pin}
              </span>
              <span className="study-open">
                Ver ficha completa{" "}
                <span aria-hidden="true">
                  <PlusIcon />
                </span>
              </span>
            </button>
          }
        >
          <dl className="pd-list">
            {study.details.map((row) => (
              <div key={row.k}>
                <dt>{row.k}</dt>
                <dd>{row.v}</dd>
              </div>
            ))}
          </dl>
        </InfoDialog>
      ))}
    </>
  );
}
export function Comparison({ item }: { item: ProductContent["ba"][number] }) {
  const [value, setValue] = useState(50);
  return (
    <div className="ba rv">
      <div
        className="compare"
        data-photos={item.before && item.after ? "" : undefined}
        style={{ "--x": `${value}%` } as CSSProperties}
      >
        {item.before && item.after ? (
          <>
            <img
              className="side before"
              src={img(item.before)}
              alt={`${item.t}: antes`}
              loading="lazy"
              draggable={false}
            />
            <img
              className="side after"
              src={img(item.after)}
              alt={`${item.t}: depois`}
              loading="lazy"
              draggable={false}
            />
          </>
        ) : (
          <>
            <div className="side before">
              <Sym name="cam" />
              Foto real · antes
            </div>
            <div className="side after">
              <Sym name="cam" />
              Foto real · depois
            </div>
          </>
        )}
        <span className="lbl l">ANTES</span>
        <span className="lbl r">DEPOIS</span>
        <div className="handle" />
        <Slider
          className="comparison-slider"
          min={0}
          max={100}
          step={1}
          value={[value]}
          onValueChange={(values) => setValue(values[0] ?? 50)}
          thumbLabel={`Comparar antes e depois: ${item.t}`}
          thumbValueText={`${value}% antes e ${100 - value}% depois`}
        />
      </div>
      <div>
        <b>{item.t}</b>
        <br />
        <span>{item.s}</span>
      </div>
    </div>
  );
}
/** "2026-01-14" → "14/01/2026" */
const dateBR = (iso: string) => iso.split("-").reverse().join("/");
/** Iniciais do avatar: as duas primeiras palavras com mais de 2 letras. */
const initials = (name: string) =>
  name
    .split(" ")
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
export function Reviews({ product }: { product: ProductContent }) {
  return (
    <>
      {product.reviews.map((review) => (
        <article
          className={`rev rv ${review.photo ? "" : "rev-text-only"}`}
          key={`${product.short}-${review.name}`}
        >
          {review.photo && (
            <figure className="rev-photo">
              <img
                src={img(review.photo)}
                alt={`Foto enviada por cliente: ${product.name}`}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <Sym name="check" />
                Foto real do cliente
              </figcaption>
            </figure>
          )}
          <Stars score={review.stars} />
          {review.text &&
            (review.summary ? (
              <p className="rev-summary">{review.text}</p>
            ) : (
              <blockquote>“{review.text}”</blockquote>
            ))}
          {review.source && (
            <span className="rev-source">
              {review.summary ? "Resumo da avaliação no" : "Avaliação no"} {review.source}
            </span>
          )}
          <div className="who">
            <span className="av" aria-hidden="true">
              {initials(review.name)}
            </span>
            <div>
              <b>{review.name}</b>
              <span>
                {review.city}, {review.uf} · {dateBR(review.date)}
              </span>
            </div>
          </div>
          <Pending>Nome ilustrativo</Pending>
        </article>
      ))}
    </>
  );
}

/** Passos do mecanismo: cada cartão abre um popup com o detalhe (hover/foco no desktop, toque no celular). */
export function MechSteps({ steps }: { steps: { b: string; p: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const mouse = useRef(false);
  return (
    <ol className="mech-steps" id="mechSteps">
      {steps.map((step, i) => (
        <li key={step.b} className="rv" style={{ "--i": i } as CSSProperties}>
          <Popover open={open === i} onOpenChange={(value) => setOpen(value ? i : null)}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="mech-card"
                onPointerEnter={(e) => {
                  mouse.current = e.pointerType === "mouse";
                  if (mouse.current) setOpen(i);
                }}
                onPointerLeave={() => mouse.current && setOpen(null)}
                // com mouse o popup já abriu no hover: o clique não deve fechá-lo
                onClick={(e) => mouse.current && open === i && e.preventDefault()}
              >
                <span className="mech-n" aria-hidden="true">
                  {i + 1}
                </span>
                <b>{step.b}</b>
                <span className="mech-more" aria-hidden="true">
                  <PlusIcon />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="mech-pop"
              side="bottom"
              align="start"
              sideOffset={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <span className="mech-pop-step">
                Passo {i + 1} de {steps.length}
              </span>
              <b>{step.b}</b>
              <p>{step.p}</p>
            </PopoverContent>
          </Popover>
        </li>
      ))}
    </ol>
  );
}
