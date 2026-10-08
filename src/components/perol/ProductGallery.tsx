import { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { img } from "./format";
import { CarouselNavigation } from "./controls";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type Props = {
  name: string;
  gallery: string[];
  chip: string;
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const AUTOPLAY_MS = 2500;

// Galeria do topo: Embla cuida de arraste e inércia; miniaturas e contador só leem o índice dele.
// O pai usa key={produto}, então trocar F5/Lavix remonta tudo no slide 0, sem animação.
export function ProductGallery({ name, gallery, chip }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);
  const thumbs = useRef<HTMLDivElement>(null);
  const total = gallery.length;
  // quem pede menos movimento começa pausado e pode ligar no botão
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) setPlaying(false);
  }, [reduce]);

  // Passa a foto sozinho; o timer reinicia a cada troca (inclusive manual) e volta à primeira no fim.
  useEffect(() => {
    if (!api || !playing || hovered || total < 2) return;
    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      api.scrollTo(api.selectedScrollSnap() + 1 >= total ? 0 : api.selectedScrollSnap() + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [api, playing, hovered, index, total]);

  useEffect(() => {
    if (!api) return;
    const sync = () => setIndex(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  // Mantém a miniatura ativa visível rolando só a faixa (scrollIntoView também rolaria a página).
  useEffect(() => {
    const strip = thumbs.current;
    const active = strip?.children[index];
    if (!strip || !active || typeof strip.scrollBy !== "function") return;
    const s = strip.getBoundingClientRect();
    const t = active.getBoundingClientRect();
    const left =
      t.left < s.left || t.right > s.right ? t.left - s.left - (s.width - t.width) / 2 : 0;
    const top =
      t.top < s.top || t.bottom > s.bottom ? t.top - s.top - (s.height - t.height) / 2 : 0;
    if (left || top) strip.scrollBy({ left, top, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [index]);

  return (
    <div className="gallery-wrap">
      <div className="gallery">
        <div className="thumbs" id="thumbs" ref={thumbs}>
          {gallery.map((file, i) => (
            <Button
              variant="ghost"
              size="icon"
              className="h-auto w-full"
              key={file}
              type="button"
              aria-label={`Ver foto ${i + 1}`}
              aria-current={index === i ? "true" : "false"}
              onClick={() => {
                setPlaying(false);
                api?.scrollTo(i, reducedMotion());
              }}
            >
              <img src={img(file)} alt="" loading="lazy" />
            </Button>
          ))}
        </div>
        <Carousel
          className="main-img group"
          id="mainImg"
          setApi={setApi}
          opts={{ align: "start", loop: false, duration: reduce ? 0 : 25 }}
          aria-label={`Fotos de ${name}`}
          tabIndex={0}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onPointerDown={(event) => {
            if (!(event.target as HTMLElement).closest("[data-carousel-playback]"))
              setPlaying(false);
          }}
          onFocusCapture={(event) => {
            if (!(event.target as HTMLElement).closest("[data-carousel-playback]"))
              setPlaying(false);
          }}
        >
          <CarouselContent className="ml-0 gap-3">
            {gallery.map((file, i) => (
              <CarouselItem
                key={file}
                className="slide pl-0 max-[640px]:basis-[88%]"
                aria-label={`${i + 1} de ${total}`}
              >
                <img
                  src={img(file)}
                  alt={`${name}, foto ${i + 1}`}
                  // Só a foto atual e a seguinte carregam já; o resto espera (aspect-ratio fixo evita CLS).
                  loading={i <= index + 1 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Chips e contador ficam fora do trilho: não rolam junto com as fotos. */}
          <div className="tag">
            <span className="chip" data-k="chip1">
              {chip}
            </span>
            <span className="chip light">ISO 9001</span>
          </div>
          <CarouselNavigation
            index={index}
            total={total}
            label="Fotos"
            counterId="imgCount"
            previous="Foto anterior"
            next="Próxima foto"
            playback={{
              playing,
              onToggle: () => setPlaying((value) => !value),
              pause: "Pausar fotos",
              play: "Reproduzir fotos",
            }}
          />
        </Carousel>
      </div>
    </div>
  );
}
