import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicationsCarousel } from "@/components/perol/ApplicationsCarousel";
import { ProductFaq } from "@/components/perol/controls";
import { PRODUCTS } from "@/content/flotador";
import { mockEmblaLayout } from "./embla-layout";

beforeEach(() => mockEmblaLayout());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Aplicações e FAQ", () => {
  it("permite explorar todos os ambientes por botões e teclado", () => {
    vi.useFakeTimers();
    try {
      render(<ApplicationsCarousel product={PRODUCTS.f5} />);
      const carousel = screen.getByRole("region", { name: /Ambientes de uso/ });
      expect(within(carousel).getAllByRole("heading", { level: 4 })).toHaveLength(
        PRODUCTS.f5.photos.length,
      );
      expect(screen.getByRole("button", { name: "Ambiente anterior" })).toBeEnabled();
      fireEvent.click(screen.getByRole("button", { name: "Próximo ambiente" }));
      expect(carousel.querySelector(".count")).toHaveTextContent("2 / 4");
      fireEvent.keyDown(carousel, { key: "ArrowDown" });
      fireEvent.keyDown(carousel, { key: "ArrowDown" });
      expect(carousel.querySelector(".count")).toHaveTextContent("4 / 4");
      expect(screen.getByRole("button", { name: "Próximo ambiente" })).toBeEnabled();
      fireEvent.keyDown(carousel, { key: "ArrowUp" });
      expect(carousel.querySelector(".count")).toHaveTextContent("3 / 4");
    } finally {
      vi.useRealTimers();
    }
  });

  it("passa sozinho a cada 2,5 s, volta ao início e pausa com o mouse", () => {
    vi.useFakeTimers();
    try {
      render(<ApplicationsCarousel product={PRODUCTS.f5} />);
      const carousel = screen.getByRole("region", { name: /Ambientes de uso/ });
      const count = () => carousel.querySelector(".count");
      act(() => void vi.advanceTimersByTime(2400));
      expect(count()).toHaveTextContent("1 / 4");
      act(() => void vi.advanceTimersByTime(100));
      expect(count()).toHaveTextContent("2 / 4");
      fireEvent.mouseEnter(carousel);
      act(() => void vi.advanceTimersByTime(10000));
      expect(count()).toHaveTextContent("2 / 4");
      fireEvent.mouseLeave(carousel);
      act(() => void vi.advanceTimersByTime(2500));
      expect(count()).toHaveTextContent("3 / 4");
      act(() => void vi.advanceTimersByTime(2500));
      expect(count()).toHaveTextContent("4 / 4");
      act(() => void vi.advanceTimersByTime(2500));
      expect(count()).toHaveTextContent("1 / 4");
    } finally {
      vi.useRealTimers();
    }
  });

  it("recomeça com as aplicações do novo produto", () => {
    const { rerender } = render(<ApplicationsCarousel key="f5" product={PRODUCTS.f5} />);
    fireEvent.click(screen.getByRole("button", { name: "Próximo ambiente" }));
    rerender(<ApplicationsCarousel key="lx" product={PRODUCTS.lx} />);
    const carousel = screen.getByRole("region", { name: /Lavix/ });
    expect(carousel.querySelector(".count")).toHaveTextContent("1 / 4");
    expect(screen.getByRole("heading", { name: "Lavanderias" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Recepções e halls" })).toBeNull();
  });

  it("abre uma resposta de cada vez e identifica informações ainda pendentes", () => {
    render(<ProductFaq product={PRODUCTS.f5} />);
    const first = screen.getByRole("button", { name: "Onde posso usar o F5 Flotador?" });
    const second = screen.getByRole("button", { name: "Precisa diluir?" });
    expect(first).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    const answer = document.getElementById(second.getAttribute("aria-controls")!)!;
    expect(answer).toHaveTextContent("Pendente");
    expect(answer).toHaveTextContent("Informação a confirmar: diluição recomendada.");
    fireEvent.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });
});
