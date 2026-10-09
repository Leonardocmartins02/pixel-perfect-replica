import { useEffect, useState } from "react";
import type { ProductContent } from "@/content/flotador";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselNavigation } from "./controls";
import { ICONS } from "./illustrations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const AUTOPLAY_MS = 2500;

export function ApplicationsCarousel({ product }: { product: ProductContent }) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);
  useEffect(() => {
    if (!api) return;
    const sync = () => setIndex(api.selectedScrollSnap());
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api]);

  // Passa sozinho a cada 2,5 s e volta ao início no fim; o timer reinicia a cada troca (botão, arraste ou teclado).
  // Pausa com o mouse ou o foco; movimento reduzido começa com reprodução desligada.
  useEffect(() => {
    if (!api || !playing || hovered || focused || product.photos.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [api, playing, hovered, focused, index, product.photos.length]);

  if (!product.photos.length) return null;

  return (
    <div className="applications rv">
      <div className="applications-heading">
        <h3>Encontre o seu ambiente</h3>
        <p>Explore as aplicações de {product.short}.</p>
      </div>
      <Carousel
        orientation="vertical"
        id="photoRow"
        className="applications-carousel"
        aria-label={`Ambientes de uso de ${product.name}`}
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={(event) => {
          if (!(event.target as HTMLElement).closest("[data-carousel-playback]")) setFocused(true);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          loop: true,
          duration: reduced ? 0 : 25,
        }}
      >
        <CarouselContent className="applications-track">
          {product.photos.map(([file, label, description, icon], i) => (
            <CarouselItem
              key={file}
              className="application-slide"
              aria-label={`${i + 1} de ${product.photos.length}: ${label}`}
            >
              <figure className="application-card">
                <div className="application-top">
                  <span
                    className="application-icon"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: ICONS[icon ?? ""] ?? "" }}
                  />
                  <span className="application-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <figcaption>
                  <h4>{label}</h4>
                  {description && <p>{description}</p>}
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation
          index={index}
          total={product.photos.length}
          previous="Ambiente anterior"
          next="Próximo ambiente"
          label="Ambientes"
          playback={{
            playing,
            onToggle: () => {
              setPlaying((value) => !value);
              setFocused(false);
            },
            pause: "Pausar ambientes",
            play: "Reproduzir ambientes",
          }}
        />
      </Carousel>
    </div>
  );
}
