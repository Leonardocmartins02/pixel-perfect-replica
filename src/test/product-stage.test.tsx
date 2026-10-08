import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PerolPage } from "@/components/perol/PerolPage";
import { PRODUCTS, type ProductId } from "@/content/flotador";

const secao = () => document.querySelector<HTMLElement>("#duvidas")!;

function mockStacked(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches: query.includes("980") ? matches : false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Palco das objeções", () => {
  it.each<ProductId>(["f5", "lx"])("%s: cada dúvida tem palco com conteúdo específico", (id) => {
    for (const objection of PRODUCTS[id].obj) {
      expect(objection.stage.title).not.toBe("");
      expect(objection.stage.items.length).toBeGreaterThan(0);
      expect(objection.stage.img).toMatch(new RegExp(`^${id === "lx" ? "lx" : "f5"}-`));
    }
  });

  it("desktop: um palco só, na dúvida 1 de N", () => {
    mockStacked(false);
    render(<PerolPage />);
    const total = PRODUCTS.f5.obj.length;
    expect(secao().querySelectorAll(".stage")).toHaveLength(1);
    expect(within(secao()).getByText(`Dúvida 1 de ${total}`)).toBeInTheDocument();
    expect(within(secao()).getByRole("heading", { level: 4 })).toHaveTextContent(
      PRODUCTS.f5.obj[0]!.stage.title,
    );
  });

  it("mobile: cada cartão traz o seu palco, sem palco sticky", () => {
    mockStacked(true);
    render(<PerolPage />);
    expect(secao().querySelectorAll(".stage")).toHaveLength(PRODUCTS.f5.obj.length);
    expect(secao().querySelector(".obj-stage-wrap")).toBeNull();
    for (const card of secao().querySelectorAll("article")) {
      expect(card.querySelector(".stage")).not.toBeNull();
    }
  });

  it("o que falta aparece como 'Pendente' no cartão, sem número inventado", () => {
    mockStacked(false);
    render(<PerolPage />);
    for (const objection of PRODUCTS.f5.obj.filter((o) => o.pend)) {
      expect(within(secao()).getByText(objection.pend!)).toHaveClass("pend");
    }
    expect(secao().textContent).not.toMatch(/R\$|\d+\s?%/);
  });

  it("trocar para Lavix troca o conteúdo do palco", () => {
    mockStacked(false);
    render(<PerolPage />);
    fireEvent.click(screen.getByRole("radio", { name: "Lavix" }));
    expect(within(secao()).getByRole("heading", { level: 4 })).toHaveTextContent(
      PRODUCTS.lx.obj[0]!.stage.title,
    );
    expect(secao().querySelector(".stage img")?.getAttribute("src")).toContain("/img/lx-");
  });
});
