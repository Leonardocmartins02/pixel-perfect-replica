import { useEffect, useState } from "react";
import type { ProductContent } from "@/content/flotador";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselNavigation } from "./controls";
import { img } from "./format";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ApplicationsCarousel({ product }: { product: ProductContent }) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!api) return;
    const sync = () => setIndex(api.selectedScrollSnap());
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api]);

  if (!product.photos.length) return null;

  return (
    <div className="applications rv">
      <div className="applications-heading">
        <h3>Encontre o seu ambiente</h3>
        <p>Explore as aplicações de {product.short}.</p>
      </div>
      <Carousel
        id="photoRow"
        className="applications-carousel"
        aria-label={`Ambientes de uso de ${product.name}`}
        tabIndex={0}
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          loop: false,
          duration: reduced ? 0 : 25,
        }}
      >
        <CarouselContent className="applications-track">
          {product.photos.map(([file, label, description], i) => (
            <CarouselItem
              key={file}
              className="application-slide"
              aria-label={`${i + 1} de ${product.photos.length}: ${label}`}
            >
              <figure className="application-card">
                <div className="application-media">
                  <img
                    src={img(file)}
                    alt={`${product.short} em ${label.toLocaleLowerCase("pt-BR")}`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    width={1000}
                    height={1000}
                  />
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
        />
      </Carousel>
    </div>
  );
}
