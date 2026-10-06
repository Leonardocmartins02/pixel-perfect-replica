import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { MediaAsset } from "@/content/flotador";
import { MediaPlaceholder } from "./Pending";

/** Tempo de cada foto no palco. Há botão de pausa (WCAG 2.2.2). */
export const HERO_INTERVAL_MS = 4000;
/** Sem fotos aprovadas, o palco mostra estes espaços "Pendente" para a troca ficar visível na prévia. */
const PENDING_SLOTS = 3;
/**
 * Fundos do palco, em rodízio (tokens --hero-tone-* em styles.css).
 * Nomes escritos por inteiro: o Tailwind não gera classes montadas em template string.
 */
const TONE_CLASSES = ["hero-bg-1", "hero-bg-2", "hero-bg-3"];
const TONES = TONE_CLASSES.length;

/** Partículas decorativas (posição, tamanho em px e defasagem da animação). */
const FLOATERS = [
  { left: "8%", top: "14%", size: 14, delay: "0s" },
  { left: "82%", top: "18%", size: 22, delay: "-2s" },
  { left: "90%", top: "46%", size: 10, delay: "-4s" },
  { left: "12%", top: "60%", size: 18, delay: "-1s" },
  { left: "70%", top: "78%", size: 12, delay: "-3s" },
  { left: "30%", top: "88%", size: 16, delay: "-5s" },
];

type Slide = { key: string; image: MediaAsset | null; label: string };

function buildSlides(images: MediaAsset[]): Slide[] {
  if (images.length) return images.map((image) => ({ key: image.src, image, label: image.alt }));
  return Array.from({ length: PENDING_SLOTS }, (_, i) => ({
    key: `pendente-${i}`,
    image: null,
    label: `Foto ${i + 1} do Flotador Perol (imagem real e autorizada)`,
  }));
}

/**
 * Palco do hero: as fotos se revezam como na referência — a que sai encolhe e desce,
 * a próxima cresce no lugar e o fundo troca de cor. Pausa ao passar o mouse ou focar
 * os controles; não troca sozinho com movimento reduzido.
 */
export function HeroCarousel({ images, children }: { images: MediaAsset[]; children?: ReactNode }) {
  const slides = buildSlides(images);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const running = count > 1 && playing && !hovered && !focused;

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [running, count]);

  const go = (i: number) => setIndex((i + count) % count);

  return (
    <div
      className="hero-stage"
      data-tone={(index % TONES) + 1}
      role="group"
      aria-roledescription="carrossel"
      aria-label="Fotos do Flotador Perol"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {slides.map((s, i) => (
        <div
          key={`bg-${s.key}`}
          aria-hidden="true"
          className={`hero-bg ${TONE_CLASSES[i % TONES]}`}
          data-active={i === index}
        />
      ))}
      <div aria-hidden="true" className="hero-floaters">
        {FLOATERS.map((f) => (
          <span
            key={f.left + f.top}
            className="hero-floater"
            style={{
              left: f.left,
              top: f.top,
              width: f.size,
              height: f.size,
              animationDelay: f.delay,
            }}
          />
        ))}
      </div>

      {slides.map((s, i) => (
        <div
          key={s.key}
          className="hero-slide"
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} de ${count}`}
          aria-hidden={i !== index}
          data-active={i === index}
        >
          <div className="hero-product">
            {s.image ? (
              <img src={s.image.src} alt={s.image.alt} className="hero-product-img" />
            ) : (
              <MediaPlaceholder label={s.label} ratio="4 / 3" />
            )}
          </div>
        </div>
      ))}

      {count > 1 && (
        <div
          className="hero-controls"
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
          }}
        >
          <button
            type="button"
            className="hero-control"
            aria-label="Foto anterior"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <div className="flex items-center">
            {slides.map((s, i) => (
              <button
                key={`dot-${s.key}`}
                type="button"
                className="hero-dot"
                aria-label={`Ir para a foto ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="hero-control"
            aria-label="Próxima foto"
            onClick={() => go(index + 1)}
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            className="hero-control"
            aria-label={playing ? "Pausar troca de fotos" : "Retomar troca de fotos"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <Pause aria-hidden="true" size={16} />
            ) : (
              <Play aria-hidden="true" size={16} />
            )}
          </button>
        </div>
      )}
      <p className="sr-only" aria-live={running ? "off" : "polite"}>
        Foto {index + 1} de {count}
      </p>
      {children}
    </div>
  );
}
