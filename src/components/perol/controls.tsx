import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  kitsForVolume,
  type Volume,
  type KitId,
  type ProductContent,
  type ProductId,
} from "@/content/flotador";
import { KitOption, Pending } from "./sections";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

/** The same touch targets, progress and ordering across all product carousels. */
export function CarouselNavigation({
  index,
  total,
  previous,
  next,
  label,
  counterId,
  playback,
}: {
  index: number;
  total: number;
  previous: string;
  next: string;
  label: string;
  counterId?: string;
  playback?: { playing: boolean; onToggle: () => void; pause: string; play: string };
}) {
  return (
    <div className="carousel-navigation">
      <div className="carousel-position">
        <span className="carousel-label">{label}</span>
        <div className="progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${(index + 1) / total})` }} />
        </div>
        <span
          className="count"
          id={counterId}
          aria-live={playback?.playing ? "off" : "polite"}
          aria-atomic="true"
        >
          {index + 1} / {total}
        </span>
      </div>
      <div className="carousel-actions">
        {playback && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="carousel-control"
            data-carousel-playback
            aria-label={playback.playing ? playback.pause : playback.play}
            aria-pressed={!playback.playing}
            onClick={playback.onToggle}
          >
            {playback.playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </Button>
        )}
        <CarouselPrevious className="carousel-control static translate-y-0" aria-label={previous} />
        <CarouselNext className="carousel-control static translate-y-0" aria-label={next} />
      </div>
    </div>
  );
}

export function ProductSelector({
  value,
  onChange,
}: {
  value: ProductId;
  onChange: (value: ProductId) => void;
}) {
  return (
    <ToggleGroup
      className="switch"
      type="single"
      value={value}
      aria-label="Escolher produto"
      onValueChange={(next) => {
        if (next === "f5" || next === "lx") onChange(next);
      }}
    >
      <ToggleGroupItem value="f5" data-p="f5">
        <i aria-hidden="true" />
        F5 Flotador
      </ToggleGroupItem>
      <ToggleGroupItem value="lx" data-p="lx">
        <i aria-hidden="true" />
        Lavix
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function VolumeSelector({
  value,
  onChange,
}: {
  value: Volume;
  onChange: (value: Volume) => void;
}) {
  return (
    <ToggleGroup
      className="switch"
      type="single"
      value={String(value)}
      aria-label="Volume da embalagem"
      onValueChange={(next) => {
        if (next === "1" || next === "5") onChange(Number(next) as Volume);
      }}
    >
      <ToggleGroupItem value="1">1 L</ToggleGroupItem>
      <ToggleGroupItem value="5">5 L</ToggleGroupItem>
    </ToggleGroup>
  );
}

export function KitSelector({
  value,
  productId,
  volume = 1,
  onChange,
}: {
  value: KitId;
  productId: ProductId;
  volume?: Volume;
  onChange: (value: KitId) => void;
}) {
  return (
    <RadioGroup
      className="kits"
      id="kits"
      aria-label="Kit"
      value={value}
      onValueChange={(next) => {
        if (next === "u1" || next === "u2" || next === "cx6") onChange(next);
      }}
    >
      {kitsForVolume(volume).map((item) => (
        <KitOption key={item.id} item={item} productId={productId} volume={volume} />
      ))}
    </RadioGroup>
  );
}

export function ProductFaq({ product }: { product: ProductContent }) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="faq-0"
      id="faqList"
      className="perol-faq-list"
    >
      {product.faq.map((item, index) => (
        <AccordionItem key={item.q} value={`faq-${index}`} className="perol-faq-item rv">
          <AccordionTrigger className="perol-faq-trigger">
            <span>{item.q}</span>
            <span className="faq-toggle" aria-hidden="true" />
          </AccordionTrigger>
          <AccordionContent className="perol-faq-answer">
            {item.a ? (
              <p>{item.a}</p>
            ) : (
              <div className="faq-pending">
                <Pending>Pendente</Pending>
                <p>Informação a confirmar: {item.p}.</p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ReviewFilter({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      className="filters"
      id="filters"
      aria-label="Filtrar avaliações por segmento"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
    >
      {items.map((label) => (
        <ToggleGroupItem key={label} value={label}>
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
