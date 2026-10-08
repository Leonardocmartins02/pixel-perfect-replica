import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PerolPage } from "@/components/perol/PerolPage";
import { PRODUCTS } from "@/content/flotador";
import { mockEmblaLayout } from "./embla-layout";

const mainImg = () => document.querySelector<HTMLElement>("#mainImg")!;
const counter = () => document.querySelector("#imgCount")!.textContent;

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  mockEmblaLayout();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Galeria do topo (Embla)", () => {
  it("renderiza todas as fotos com alt e começa em 1 / N", () => {
    render(<PerolPage />);
    const total = PRODUCTS.f5.gallery.length;
    PRODUCTS.f5.gallery.forEach((_, i) => {
      expect(
        within(mainImg()).getByRole("img", { name: `${PRODUCTS.f5.name}, foto ${i + 1}` }),
      ).toBeInTheDocument();
    });
    expect(counter()).toBe(`1 / ${total}`);
  });

  it("clicar na miniatura muda o contador e o aria-current", () => {
    render(<PerolPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ver foto 4" }));
    expect(counter()).toBe(`4 / ${PRODUCTS.f5.gallery.length}`);
    expect(screen.getByRole("button", { name: "Ver foto 4" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Ver foto 1" })).toHaveAttribute(
      "aria-current",
      "false",
    );
  });

  it("as setas do teclado avançam e voltam", () => {
    render(<PerolPage />);
    fireEvent.keyDown(mainImg(), { key: "ArrowRight" });
    expect(counter()).toBe(`2 / ${PRODUCTS.f5.gallery.length}`);
    fireEvent.keyDown(mainImg(), { key: "ArrowLeft" });
    expect(counter()).toBe(`1 / ${PRODUCTS.f5.gallery.length}`);
  });

  it("trocar para Lavix volta para 1 / N do Lavix", () => {
    render(<PerolPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ver foto 3" }));
    fireEvent.click(screen.getByRole("radio", { name: "Lavix" }));
    expect(counter()).toBe(`1 / ${PRODUCTS.lx.gallery.length}`);
    expect(screen.getByRole("button", { name: "Ver foto 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      within(mainImg()).getByRole("img", { name: `${PRODUCTS.lx.name}, foto 1` }),
    ).toBeInTheDocument();
  });

  it("expõe a semântica de carrossel", () => {
    render(<PerolPage />);
    expect(mainImg()).toHaveAttribute("aria-roledescription", "carousel");
    expect(mainImg()).toHaveAccessibleName(`Fotos de ${PRODUCTS.f5.name}`);
    const slides = within(mainImg()).getAllByRole("group");
    expect(slides).toHaveLength(PRODUCTS.f5.gallery.length);
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
    expect(slides[0]).toHaveAccessibleName(`1 de ${PRODUCTS.f5.gallery.length}`);
    expect(screen.getByRole("button", { name: "Foto anterior" })).toBeDisabled();
  });

  it("só a foto atual e a seguinte carregam já", () => {
    render(<PerolPage />);
    const imgs = within(mainImg()).getAllByRole("img");
    expect(imgs.map((el) => el.getAttribute("loading")).slice(0, 4)).toEqual([
      "eager",
      "eager",
      "lazy",
      "lazy",
    ]);
  });
  it("passa as fotos sozinho a cada 2,5 s e o botão de pausa interrompe", () => {
    vi.useFakeTimers();
    try {
      render(<PerolPage />);
      act(() => void vi.advanceTimersByTime(2600));
      expect(counter()).toBe(`2 / ${PRODUCTS.f5.gallery.length}`);
      fireEvent.click(screen.getByRole("button", { name: "Pausar fotos" }));
      act(() => void vi.advanceTimersByTime(8000));
      expect(counter()).toBe(`2 / ${PRODUCTS.f5.gallery.length}`);
      fireEvent.click(screen.getByRole("button", { name: "Reproduzir fotos" }));
      act(() => void vi.advanceTimersByTime(2600));
      expect(counter()).toBe(`3 / ${PRODUCTS.f5.gallery.length}`);
    } finally {
      vi.useRealTimers();
    }
  });
});
