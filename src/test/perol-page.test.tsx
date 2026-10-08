import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { PerolPage } from "@/components/perol/PerolPage";
import { CHECKOUT, PRICES } from "@/content/flotador";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
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
    // o comportamento da galeria (miniaturas, contador) é testado em product-gallery.test.tsx
    fireEvent.click(screen.getByRole("radio", { name: "Lavix" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LavixFinalizador");
    expect(screen.getByText("Em quais tecidos posso usar?")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /1 un\./ })).toBeChecked();
    expect(screen.getByRole("button", { name: "Ver foto 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(window.location.hash).toBe("#lavix");
  });

  it("mantém Lavix ao navegar para uma seção", () => {
    render(<PerolPage />);
    fireEvent.click(screen.getByRole("radio", { name: "Lavix" }));
    window.history.replaceState(null, "", "/#comprar");
    fireEvent(window, new HashChangeEvent("hashchange"));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LavixFinalizador");
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
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider).toHaveAttribute("aria-valuenow", "51");
    expect(slider).toHaveAttribute("aria-valuetext", "51% antes e 49% depois");
    expect(slider.closest(".compare")?.getAttribute("style")).toContain("--x: 51%");
    fireEvent.keyDown(slider, { key: "End" });
    expect(slider).toHaveAttribute("aria-valuenow", "100");
    fireEvent.keyDown(slider, { key: "Home" });
    expect(slider).toHaveAttribute("aria-valuenow", "0");
  });

  it("seleciona kits pelas setas do teclado", async () => {
    const user = userEvent.setup();
    render(<PerolPage />);
    const one = screen.getByRole("radio", { name: /1 un\./ });
    const two = screen.getByRole("radio", { name: /2 un\./ });
    await user.click(one);
    // Radix schedules roving focus; keep the key held until that focus event runs.
    await user.keyboard("{ArrowRight>}");
    await waitFor(() => expect(two).toBeChecked());
    expect(two).toHaveFocus();
    await user.keyboard("{/ArrowRight}");
  });

  it("abre FAQ pelo teclado e mantém a associação entre pergunta e resposta", async () => {
    const user = userEvent.setup();
    render(<PerolPage />);
    const question = screen.getByRole("button", { name: "Precisa diluir?" });
    expect(question).toHaveAttribute("aria-expanded", "false");
    question.focus();
    await user.keyboard("{Enter}");
    expect(question).toHaveAttribute("aria-expanded", "true");
    const answer = document.getElementById(question.getAttribute("aria-controls")!);
    expect(answer).toHaveTextContent("diluição recomendada");
    await user.keyboard("{Enter}");
    expect(question).toHaveAttribute("aria-expanded", "false");
  });

  it("mantém um produto selecionado e alterna usando o teclado", async () => {
    const user = userEvent.setup();
    render(<PerolPage />);
    const first = screen.getByRole("radio", { name: "F5 Flotador" });
    await user.click(first);
    expect(first).toBeChecked();
    await user.keyboard("{ArrowRight}");
    await waitFor(() => expect(screen.getByRole("radio", { name: "Lavix" })).toHaveFocus());
    await user.keyboard(" ");
    expect(screen.getByRole("radio", { name: "Lavix" })).toBeChecked();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("LavixFinalizador");
  });

  it("entrega todo o conteúdo e imagens locais desde a renderização", () => {
    const { container } = render(<PerolPage />);
    expect(container.querySelectorAll("main section")).toHaveLength(12);
    expect(within(container.querySelector("#kits")!).getAllByRole("radio")).toHaveLength(3);
    for (const image of container.querySelectorAll("img"))
      expect(image.getAttribute("src")).toMatch(/^\/img\/.+\.webp$/);
  });
  it("mantém no DOM a ordem título, nota, descrição, checks (o mobile reordena só por CSS)", () => {
    const { container } = render(<PerolPage />);
    const kids = [...container.querySelector("#comprar .info")!.children].map(
      (el) => el.className || el.tagName,
    );
    expect(kids.slice(0, 5)).toEqual(["H1", "rating-row", "eyebrow desc-title", "sub", "ticks"]);
  });
  it("cada passo do mecanismo abre um popup com o detalhe ao clicar", async () => {
    const user = userEvent.setup();
    render(<PerolPage />);
    const passo = screen.getByRole("button", { name: /Os tensoativos chegam na sujeira/ });
    expect(screen.queryByText(/lado que se liga à gordura/)).not.toBeInTheDocument();
    await user.click(passo);
    expect(await screen.findByText(/lado que se liga à gordura/)).toBeInTheDocument();
  });
  it("sem dado de avaliação, mostra o campo Pendente e não inventa nota", () => {
    const { container } = render(<PerolPage />);
    const row = container.querySelector(".rating-row")!;
    expect(row).toHaveTextContent("–,–");
    expect(row.querySelector(".pend")).toBeInTheDocument();
  });
});
