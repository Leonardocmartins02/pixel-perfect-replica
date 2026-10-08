import { useEffect, useState, type CSSProperties } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { img } from "./format";
import { Pending } from "./sections";

type Props = {
  name: string;
  gallery: string[];
  /** [arquivo, legenda]: a legenda só aparece quando já existe texto no conteúdo. */
  captions?: [string, string][];
};

// Packshots (frasco isolado) ficam de fora: o anel mostra só as fotos de cena de product.gallery.
const PACKSHOT = /-(pack|close)$/;
const MAX_D = 3;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Posição contínua de cada slide em relação ao centro (-3..3), lida do Embla durante o arraste.
// Escrevemos --d/--a direto no DOM: re-renderizar o React a cada frame de arraste seria caro.
function paint(api: NonNullable<CarouselApi>) {
  const nodes = api.slideNodes();
  const at = api.scrollProgress() * (nodes.length - 1);
  nodes.forEach((node, i) => {
    const d = Math.max(-MAX_D, Math.min(MAX_D, i - at));
    node.style.setProperty("--d", d.toFixed(3));
    node.style.setProperty("--a", Math.abs(d).toFixed(3));
    node.style.zIndex = String(10 - Math.round(Math.abs(d)));
  });
}

// Anel de fotos de uso: Embla cuida de arraste, inércia e índice; o 3D vem do CSS (.use-ring),
// derivado de --d. Com movimento reduzido o CSS cai para um carrossel plano (fade simples).
export function UseRing({ name, gallery, captions = [] }: Props) {
  const scenes = gallery.filter((file) => !PACKSHOT.test(file));
  const start = Math.floor(scenes.length / 2);
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(start);
  const [dragging, setDragging] = useState(false);
  const [flat, setFlat] = useState(false);
  const total = scenes.length;

  useEffect(() => setFlat(reducedMotion()), []);

  useEffect(() => {
    if (!api) return;
    const select = () => setIndex(api.selectedScrollSnap());
    const move = () => paint(api);
    const down = () => setDragging(true);
    const up = () => setDragging(false);
    paint(api);
    select();
    api.on("select", select).on("reInit", select);
    api.on("scroll", move).on("reInit", move);
    api.on("pointerDown", down).on("pointerUp", up).on("settle", up);
    return () => {
      api.off("select", select).off("reInit", select);
      api.off("scroll", move).off("reInit", move);
      api.off("pointerDown", down).off("pointerUp", up).off("settle", up);
    };
  }, [api]);

  // Foco "roving": se o foco estava no anel (teclado ou clique), ele acompanha a foto ativa;
  // sem isso ele ficaria numa foto lateral com tabIndex -1.
  useEffect(() => {
    const root = api?.rootNode();
    const active = root?.querySelector<HTMLElement>('button[aria-current="true"]');
    if (root?.contains(document.activeElement) && active && document.activeElement !== active)
      active.focus({ preventScroll: true });
  }, [api, index]);

  if (!total) {
    return (
      <p className="use-ring-empty">
        <Pending>fotos de uso deste produto</Pending>
      </p>
    );
  }

  const caption = captions.find(([file]) => file === scenes[index])?.[1];

  return (
    <Carousel
      className="use-ring group"
      data-3d={flat ? "false" : "true"}
      data-dragging={dragging ? "true" : "false"}
      setApi={setApi}
      opts={{ align: "center", startIndex: start, containScroll: false, loop: false }}
      aria-label={`Fotos de uso de ${name}`}
    >
      <CarouselContent className="use-ring-track ml-0">
        {scenes.map((file, i) => {
          const label = captions.find(([f]) => f === file)?.[1];
          const active = i === index;
          const d = Math.max(-MAX_D, Math.min(MAX_D, i - start));
          return (
            <CarouselItem
              key={file}
              className="use-ring-slide pl-0"
              aria-label={`${i + 1} de ${total}`}
              style={
                {
                  "--d": d,
                  "--a": Math.abs(d),
                  zIndex: 10 - Math.abs(d),
                } as CSSProperties
              }
            >
              {/* Clique numa foto lateral a traz para o centro. Só a ativa entra na ordem de tab:
                  as setas do teclado navegam o resto (ordem de tab = ordem visual). */}
              <button
                type="button"
                tabIndex={active ? 0 : -1}
                aria-current={active ? "true" : "false"}
                aria-label={`Ver foto de uso ${i + 1}${label ? `: ${label}` : ""}`}
                onClick={() => api?.scrollTo(i, reducedMotion())}
              >
                <img
                  src={img(file)}
                  alt={label ? `${name}, ${label}` : `${name}, foto de uso ${i + 1}`}
                  loading={Math.abs(i - index) <= 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </button>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious
        aria-label="Foto de uso anterior"
        className="left-3 h-10 w-10 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 max-[980px]:hidden"
      />
      <CarouselNext
        aria-label="Próxima foto de uso"
        className="right-3 h-10 w-10 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 max-[980px]:hidden"
      />
      <p className="use-ring-caption" aria-live="polite">
        {caption ?? ""}
      </p>
      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${(index + 1) / total})` }} />
      </div>
    </Carousel>
  );
}
