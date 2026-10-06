import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HERO_INTERVAL_MS, HeroCarousel } from "@/components/advertorial/HeroCarousel";
import type { MediaAsset } from "@/content/flotador";

const fotos: MediaAsset[] = [
  { kind: "image", src: "/teste-1.png", alt: "Foto de teste 1" },
  { kind: "image", src: "/teste-2.png", alt: "Foto de teste 2" },
];

const atual = () => screen.getByRole("group", { name: /de \d+$/ });

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) => ({ matches, media: query }) as MediaQueryList,
  );
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("HeroCarousel", () => {
  it("sem fotos aprovadas mostra 3 espaços 'Pendente', só um visível por vez", () => {
    render(<HeroCarousel images={[]} />);
    expect(atual()).toHaveAccessibleName("1 de 3");
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("troca sozinho a cada intervalo e volta ao início", () => {
    vi.useFakeTimers();
    mockReducedMotion(false);
    render(<HeroCarousel images={fotos} />);

    act(() => vi.advanceTimersByTime(HERO_INTERVAL_MS));
    expect(atual()).toHaveAccessibleName("2 de 2");
    expect(screen.getByRole("img", { name: "Foto de teste 2" })).toBeVisible();
    act(() => vi.advanceTimersByTime(HERO_INTERVAL_MS));
    expect(atual()).toHaveAccessibleName("1 de 2");
  });

  it("setas e bolinhas levam à foto escolhida", () => {
    render(<HeroCarousel images={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Próxima foto" }));
    expect(atual()).toHaveAccessibleName("2 de 3");
    fireEvent.click(screen.getByRole("button", { name: "Ir para a foto 3" }));
    expect(atual()).toHaveAccessibleName("3 de 3");
    expect(screen.getByRole("button", { name: "Ir para a foto 3" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Foto anterior" }));
    expect(atual()).toHaveAccessibleName("2 de 3");
  });

  it("pausar impede a troca automática", () => {
    vi.useFakeTimers();
    mockReducedMotion(false);
    render(<HeroCarousel images={fotos} />);

    fireEvent.click(screen.getByRole("button", { name: "Pausar troca de fotos" }));
    act(() => vi.advanceTimersByTime(HERO_INTERVAL_MS * 3));
    expect(atual()).toHaveAccessibleName("1 de 2");
    expect(screen.getByRole("button", { name: "Retomar troca de fotos" })).toBeInTheDocument();
  });

  it("com movimento reduzido começa pausado", () => {
    vi.useFakeTimers();
    mockReducedMotion(true);
    render(<HeroCarousel images={fotos} />);

    act(() => vi.advanceTimersByTime(HERO_INTERVAL_MS * 2));
    expect(atual()).toHaveAccessibleName("1 de 2");
    expect(screen.getByRole("button", { name: "Retomar troca de fotos" })).toBeInTheDocument();
  });

  it("com uma foto só não há controles nem troca", () => {
    render(<HeroCarousel images={[fotos[0]!]} />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(atual()).toHaveAccessibleName("1 de 1");
  });
});
