import { useEffect, useState } from "react";
import {
  kitsForVolume,
  type EnvGuide,
  type KitId,
  type ProductContent,
  type Volume,
} from "@/content/flotador";
import { DialogClose } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CarouselNavigation } from "./controls";
import { InfoDialog } from "./sections";
import { ICONS } from "./illustrations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const AUTOPLAY_MS = 2500;

type ChooseKit = (volume: Volume, kit: KitId) => void;

/** Conteúdo do guia rápido: dose, passo a passo, dica e o kit indicado para o ambiente. */
function EnvGuidePanel({ guide, onChoose }: { guide: EnvGuide; onChoose?: ChooseKit | undefined }) {
  const kit = kitsForVolume(guide.pick.volume).find((item) => item.id === guide.pick.kit)!;
  return (
    <div className="env-guide">
      <div className="env-dose">
        <span className="env-dose-k">Dose</span>
        <b>{guide.dose}</b>
        <span>{guide.doseNote}</span>
      </div>
      <ol className="env-steps">
        {guide.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {guide.tip && <p className="env-tip">{guide.tip}</p>}
      <div className="env-pick">
        <span className="env-pick-k">Indicado para este ambiente</span>
        <b>
          {kit.title} · {kit.d}
        </b>
        <p>{guide.pick.why}</p>
        {onChoose && (
          <DialogClose asChild>
            <button
              type="button"
              className="env-pick-btn"
              onClick={() => onChoose(guide.pick.volume, guide.pick.kit)}
            >
              Escolher este kit <span aria-hidden="true">→</span>
            </button>
          </DialogClose>
        )}
      </div>
    </div>
  );
}

export function ApplicationsCarousel({
  product,
  onChoose,
}: {
  product: ProductContent;
  onChoose?: ChooseKit;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
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
  // Pausa com o mouse, o foco ou um guia aberto; movimento reduzido começa com reprodução desligada.
  useEffect(() => {
    if (!api || !playing || hovered || focused || dialogOpen || product.photos.length < 2) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [api, playing, hovered, focused, dialogOpen, index, product.photos.length]);

  if (!product.photos.length) return null;

  return (
    <div className="applications rv">
      <div className="applications-heading">
        <h3>Encontre o seu ambiente</h3>
        <p>Toque no seu ambiente e veja a dose certa e o kit indicado.</p>
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
          {product.photos.map(([file, label, description, icon], i) => {
            const guide = product.envGuide?.[file];
            const card = (
              <>
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
                <span className="application-text">
                  <span className="application-h">{label}</span>
                  {description && <span className="application-p">{description}</span>}
                  {guide && (
                    <span className="application-cta">
                      Ver guia rápido
                      <span className="application-cta-arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  )}
                </span>
              </>
            );
            return (
              <CarouselItem
                key={file}
                className="application-slide"
                aria-label={`${i + 1} de ${product.photos.length}: ${label}`}
              >
                {/* com guia o cartão vira botão e abre o popup; sem guia continua só informativo */}
                {guide ? (
                  <InfoDialog
                    eyebrow={`Guia rápido · ${product.short}`}
                    title={label}
                    lead={description}
                    onOpenChange={setDialogOpen}
                    trigger={
                      <button
                        type="button"
                        className="application-card is-guide"
                        data-current={i === index ? "" : undefined}
                        aria-label={`${label}: ver guia rápido de uso`}
                      >
                        {card}
                      </button>
                    }
                  >
                    <EnvGuidePanel guide={guide} onChoose={onChoose} />
                  </InfoDialog>
                ) : (
                  <div className="application-card">{card}</div>
                )}
              </CarouselItem>
            );
          })}
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
