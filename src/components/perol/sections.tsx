import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  PRICES,
  type KitId,
  type PerolKit,
  type ProductContent,
  type ProductId,
} from "@/content/flotador";
import { Button } from "@/components/ui/button";
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
function Jugs({ count }: { count: number }) {
  return (
    <span className="jugs">
      {Array.from({ length: count }, (_, i) => (
        <Sym key={i} name="jug" />
      ))}
    </span>
  );
}
export function KitOption({ item, productId }: { item: PerolKit; productId: ProductId }) {
  const price = PRICES[productId][item.id];
  const base = PRICES[productId].u1;
  const savings = price !== null && base !== null ? base * item.n - price : 0;
  return (
    <RadioGroupItem className="kit" value={item.id}>
      {item.flag && <span className={`flag ${item.navy ? "navy" : ""}`}>{item.flag}</span>}
      <Jugs count={item.n} />
      <span className="q">{item.q}</span>
      <span className="d">{item.d}</span>
      <span className="pr">{money(price)}</span>
      <span className="pl">
        {price === null ? "R$ ––/L" : `${money(Math.round(price / item.n))}/L`}
      </span>
      {savings > 0 && <span className="save">economize {money(savings)}</span>}
    </RadioGroupItem>
  );
}
export function OfferCard({
  item,
  productId,
  onBuy,
}: {
  item: PerolKit;
  productId: ProductId;
  onBuy: (id: KitId) => void;
}) {
  const price = PRICES[productId][item.id];
  return (
    <article className={`oc2 rv ${item.id === "cx6" ? "hl" : ""}`}>
      {item.flag && <span className="flag">{item.flag}</span>}
      <Jugs count={item.n} />
      <h3>{item.title}</h3>
      <span className="d">{item.d}</span>
      <span className="pr">{money(price)}</span>
      <span className="pl">
        {price === null
          ? "R$ ––/L · preço a definir"
          : `${money(Math.round(price / item.n))} por litro`}
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
export function Objections({ product }: { product: ProductContent }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!list.current || !("IntersectionObserver" in window)) return;
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
  }, []);
  const objection = product.obj[active]!;
  return (
    <div className="obj-grid">
      <div className="obj-stage-wrap">
        <div className="obj-stage" data-s={active}>
          <div className="orb" />
          <div className="ring" />
          <div className="prod">
            <img
              src={img(objection.img)}
              alt={product.name}
              className={objection.scene ? "scene" : ""}
            />
          </div>
          {objection.f.map((item, i) => (
            <div
              key={`${active}-${i}`}
              className={`float show ${active % 2 ? (i ? "f-bl" : "f-tr") : i ? "f-br" : "f-tl"}`}
            >
              <Sym name={item.i} />
              <div>
                <b>{item.b}</b>
                <span>{item.s}</span>
                {item.pend && <Pending>laudo</Pending>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="obj-list" ref={list}>
        {product.obj.map((item, i) => (
          <article key={item.q} className={`oc ${active === i ? "on" : ""}`} data-index={i}>
            <span className="q">
              <Sym name="q" />“{item.q}”
            </span>
            <h3>{item.h}</h3>
            <p>{item.p}</p>
            <div className="proof">
              {item.proof.map((text) => (
                <span className="ok" key={text}>
                  <Sym name="check" />
                  {text}
                </span>
              ))}
              {item.pend && <Pending>{item.pend}</Pending>}
            </div>
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
export function Stats({ product }: { product: ProductContent }) {
  return (
    <>
      {product.stats.map((item) => (
        <div
          className="stat"
          key={item.k}
          style={{ "--off": item.real ? 0 : 250 } as CSSProperties}
        >
          <svg className="gauge" viewBox="0 0 110 110">
            <circle className="bg" cx="55" cy="55" r="45" />
            <circle className="fg" cx="55" cy="55" r="45" />
            <text x="55" y="63" textAnchor="middle">
              {item.v}
            </text>
          </svg>
          <span className="k">{item.k}</span>
          {item.real ? (
            <span className="src">Fonte: {item.src}</span>
          ) : (
            <Pending>{item.src}</Pending>
          )}
        </div>
      ))}
    </>
  );
}
export function Comparison({ item }: { item: { t: string; s: string } }) {
  const [value, setValue] = useState(50);
  return (
    <div className="ba rv">
      <div className="compare" style={{ "--x": `${value}%` } as CSSProperties}>
        <div className="side before">
          <Sym name="cam" />
          Foto real · antes
        </div>
        <div className="side after">
          <Sym name="cam" />
          Foto real · depois
        </div>
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
