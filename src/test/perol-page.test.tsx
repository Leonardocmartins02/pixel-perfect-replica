import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PerolPage } from "@/components/perol/PerolPage";
import { CHECKOUT, PRICES } from "@/content/flotador";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Página importada do modelo Perol", () => {
  it("troca produto, galeria e FAQ juntos, preservando o kit selecionado", () => {
    render(<PerolPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("F5 FlotadorUniversal");
    fireEvent.click(screen.getByRole("radio", { name: /1 un\./ }));
    fireEvent.click(screen.getByRole("button", { name: "Ver foto 3" }));
    expect(screen.getByRole("button", { name: "Ver foto 3" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Lavix" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LavixFinalizador");
    expect(screen.getByText("Em quais tecidos posso usar?")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /1 un\./ })).toBeChecked();
    expect(screen.getByRole("button", { name: "Ver foto 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(window.location.hash).toBe("#lavix");
  });

  it("mantém Lavix ao navegar para uma seção e permite avançar por gesto", () => {
    const { container } = render(<PerolPage />);
    fireEvent.click(screen.getByRole("button", { name: "Lavix" }));
    window.history.replaceState(null, "", "/#comprar");
    fireEvent(window, new HashChangeEvent("hashchange"));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LavixFinalizador");
    const gallery = container.querySelector("#mainImg")!;
    fireEvent.touchStart(gallery, { touches: [{ clientX: 200 }] });
    fireEvent.touchEnd(gallery, { changedTouches: [{ clientX: 100 }] });
    expect(screen.getByRole("button", { name: "Ver foto 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("abre Lavix pelo link direto", async () => {
    window.history.replaceState(null, "", "/#lavix");
    render(<PerolPage />);
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LavixFinalizador"),
    );
  });

  it("seleciona o kit da oferta final e bloqueia compra sem aprovação, mesmo com preço e URL", () => {
    const oldPrice = PRICES.f5.u2;
    const oldCheckout = CHECKOUT.f5.u2;
    PRICES.f5.u2 = 10000;
    CHECKOUT.f5.u2 = "https://example.com/checkout";
    try {
      render(<PerolPage />);
      fireEvent.click(screen.getByRole("button", { name: "Comprar 2 unidades" }));
      expect(screen.getByRole("radio", { name: /2 un\./ })).toBeChecked();
      expect(screen.getByRole("status")).toHaveTextContent("Compra ainda indisponível");
      expect(window.location.pathname).toBe("/");
    } finally {
      PRICES.f5.u2 = oldPrice;
      CHECKOUT.f5.u2 = oldCheckout;
    }
  });

  it("atualiza o comparador por controle acessível", () => {
    render(<PerolPage />);
    const slider = screen.getByRole("slider", { name: /Piso de cozinha industrial/ });
    fireEvent.change(slider, { target: { value: "75" } });
    expect(slider.parentElement?.style.getPropertyValue("--x")).toBe("75%");
  });

  it("entrega todo o conteúdo e imagens locais desde a renderização", () => {
    const { container } = render(<PerolPage />);
    expect(container.querySelectorAll("main section")).toHaveLength(11);
    expect(within(container.querySelector("#kits")!).getAllByRole("radio")).toHaveLength(3);
    for (const image of container.querySelectorAll("img"))
      expect(image.getAttribute("src")).toMatch(/^\/img\/.+\.webp$/);
  });
});
