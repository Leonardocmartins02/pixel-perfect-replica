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
/** Selo azul de "verificado" (as cores são as do selo, por isso ficam no próprio SVG). */
export function VerifiedBadge({
  size = 18,
  label = "Avaliações verificadas",
}: {
  size?: number;
  label?: string;
}) {
  const petals = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    return { cx: 12 + Math.cos(angle) * 6.2, cy: 12 + Math.sin(angle) * 6.2 };
  });
  return (
    <svg
      className="verified"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <g fill="#0095F6">
        <circle cx="12" cy="12" r="7.6" />
        {petals.map((petal, i) => (
          <circle key={i} cx={petal.cx} cy={petal.cy} r="4.1" />
        ))}
      </g>
      <path
        d="M7.9 12.3l2.7 2.7 5.5-5.6"
        fill="none"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
const FACE_SWAP_MS = 4000;
/** Três rostos sobrepostos; a cada 4 s um deles troca por outra foto da lista (fade no CSS). */
function FaceStack({ faces, verified }: { faces: string[]; verified: boolean }) {
  const slots = Math.min(3, faces.length);
  const [shown, setShown] = useState(() => Array.from({ length: slots }, (_, i) => i));
  const slot = useRef(0);
  const next = useRef(slots);
  useEffect(() => {
    if (faces.length <= slots) return;
    const timer = window.setInterval(() => {
      const target = slot.current % slots;
      const face = next.current % faces.length;
      slot.current += 1;
      next.current += 1;
      setShown((current) => current.map((value, i) => (i === target ? face : value)));
    }, FACE_SWAP_MS);
    return () => window.clearInterval(timer);
  }, [faces.length, slots]);
  return (
    <span className="rp-stack">
      {shown.map((active, position) => (
        <span className="rp-face" key={position}>
          {faces.map((face, i) => (
            <img
              key={face}
              src={img(face)}
              alt=""
              width={40}
              height={40}
              loading={i < slots ? "eager" : "lazy"}
              data-on={i === active ? "" : undefined}
            />
          ))}
        </span>
      ))}
      {verified && (
        <span className="rp-badge">
          <VerifiedBadge size={18} />
        </span>
      )}
    </span>
  );
}
/** Avaliação abaixo do título: rostos, estrelas e total; sem dado, o campo fica "Pendente". */
export function RatingProof({ rating }: { rating: ProductContent["rating"] }) {
  if (!rating)
    return (
      <div className="rating-row">
        <Stars />
        <b className="rating-n">–,–</b>
        <span className="rating-txt">avaliações reais</span>
        <span className="pend">nota e nº de avaliações</span>
      </div>
    );
  return (
    <div className="rating-row rating-proof">
      {rating.faces && rating.faces.length > 0 && (
        <FaceStack faces={rating.faces} verified={!!rating.verified} />
      )}
      <span className="rp-text">
        <Stars score={rating.score} />
        <span className="rp-line">
          <b className="rating-n">{rating.countLabel}</b>
          <span className="rating-txt">avaliações verificadas</span>
          {rating.verified && !rating.faces?.length && <VerifiedBadge size={15} />}
        </span>
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
            {item.pend && (
              <div className="proof">
                <Pending>{item.pend}</Pending>
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
                      +
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
                Ver ficha completa <span aria-hidden="true">+</span>
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
export function Reviews({ product, filter }: { product: ProductContent; filter: string }) {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <article className="rev rv" key={`${filter}-${i}`}>
          <div className="ph">
            Foto ou print real
            <br />
            do cliente {i}
          </div>
          <span className="stars empty">
            {Array.from({ length: 5 }, (_, j) => (
              <Sym name="star" key={j} />
            ))}
          </span>
          <blockquote>
            Depoimento verdadeiro sobre o {product.short}, nas palavras do cliente.
          </blockquote>
          <div className="who">
            <span className="av" />
            <div>
              <b>Nome do cliente</b>
              <span>Cidade · {filter === "Todas" ? "tipo de negócio" : filter}</span>
            </div>
          </div>
          <span className="verified">
            <Sym name="shield" />
            Verificação pendente
          </span>
          <Pending>depoimento real</Pending>
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
                  +
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
