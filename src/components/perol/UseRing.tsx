import { useEffect, useState, type CSSProperties } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { img } from "./format";
import { Pending } from "./sections";
import { CarouselNavigation } from "./controls";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  name: string;
  gallery: string[];
  /** [arquivo, legenda]: a legenda só aparece quando já existe texto no conteúdo. */
  captions?: [string, string, string?][];
};

// Packshots (frasco isolado) ficam de fora: o anel mostra só as fotos de cena de product.gallery.
const PACKSHOT = /-(pack|close)$/;
const MAX_D = 3;
const AUTOPLAY_MS = 2500;
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
  const flat = useReducedMotion();
  const total = scenes.length;
  // quem pede menos movimento começa pausado e pode ligar no botão
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    if (flat) setPlaying(false);
  }, [flat]);

  // Passa a foto sozinho (volta à primeira no fim); o timer reinicia a cada troca e espera o arraste acabar.
  useEffect(() => {
    if (!api || !playing || hovered || dragging || total < 2) return;
    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      api.scrollTo(api.selectedScrollSnap() + 1 >= total ? 0 : api.selectedScrollSnap() + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [api, playing, hovered, dragging, index, total]);

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
      opts={{
        align: "center",
        startIndex: start,
        containScroll: false,
        loop: false,
        duration: flat ? 0 : 25,
      }}
      aria-label={`Fotos de uso de ${name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={(event) => {
        if (!(event.target as HTMLElement).closest("[data-carousel-playback]")) setPlaying(false);
      }}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest("[data-carousel-playback]")) setPlaying(false);
      }}
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
      <p
        className="use-ring-caption chip light"
        aria-live={playing ? "off" : "polite"}
        data-empty={caption ? "false" : "true"}
      >
        {caption ?? ""}
      </p>
      <CarouselNavigation
        index={index}
        total={total}
        label="Em uso"
        previous="Foto de uso anterior"
        next="Próxima foto de uso"
        playback={{
          playing,
          onToggle: () => setPlaying((value) => !value),
          pause: "Pausar fotos de uso",
          play: "Reproduzir fotos de uso",
        }}
      />
    </Carousel>
  );
}
