import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PerolPage } from "@/components/perol/PerolPage";
import { UseRing } from "@/components/perol/UseRing";
import { PRODUCTS } from "@/content/flotador";
import { mockEmblaLayout } from "./embla-layout";

const cenas = (gallery: string[]) => gallery.filter((f) => !/-(pack|close)$/.test(f));
const ring = () => document.querySelector<HTMLElement>(".use-ring")!;
const ativa = () => within(ring()).getByRole("button", { current: true });

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) => ({ matches, media: query }) as MediaQueryList,
  );
}

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  mockEmblaLayout();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Anel 3D de fotos de uso", () => {
  it("renderiza só as fotos de cena, cada uma com alt, sem packshots", () => {
    render(<PerolPage />);
    const total = cenas(PRODUCTS.f5.gallery).length;
    expect(within(ring()).getAllByRole("img")).toHaveLength(total);
    for (const img of within(ring()).getAllByRole("img")) {
      expect(img.getAttribute("alt")).toMatch(new RegExp(`^${PRODUCTS.f5.name}, `));
      expect(img.getAttribute("src")).not.toMatch(/-(pack|close)\.webp$/);
    }
    expect(ring()).toHaveAttribute("aria-roledescription", "carousel");
    expect(within(ring()).getAllByRole("group")[0]).toHaveAccessibleName(`1 de ${total}`);
  });

  it("clicar numa foto lateral a traz para o centro", () => {
    render(<PerolPage />);
    const botoes = within(ring()).getAllByRole("button", { name: /Ver foto de uso/ });
    const antes = botoes.indexOf(ativa());
    fireEvent.click(botoes[antes + 1]!);
    expect(botoes.indexOf(ativa())).toBe(antes + 1);
    expect(ring().querySelector(".progress span")).toHaveStyle({
      transform: `scaleX(${(antes + 2) / botoes.length})`,
    });
  });

  it("as setas do teclado movem o anel e o foco acompanha a foto ativa", () => {
    render(<PerolPage />);
    const botoes = within(ring()).getAllByRole("button", { name: /Ver foto de uso/ });
    const antes = botoes.indexOf(ativa());
    ativa().focus();
    fireEvent.keyDown(ativa(), { key: "ArrowRight" });
    expect(botoes.indexOf(ativa())).toBe(antes + 1);
    expect(document.activeElement).toBe(ativa());
    expect(ativa()).toHaveAttribute("tabindex", "0");
  });

  it("legenda só aparece quando já existe texto no conteúdo", () => {
    render(
      <UseRing name="Teste" gallery={["x-a", "x-b", "x-c"]} captions={[["x-b", "Pisos frios"]]} />,
    );
    expect(screen.getByText("Pisos frios")).toBeInTheDocument();
    cleanup();
    render(<UseRing name="Teste" gallery={["x-a", "x-b", "x-c"]} />);
    expect(ring().querySelector(".use-ring-caption")).toHaveTextContent("");
  });

  it("com movimento reduzido remove o 3D", () => {
    mockReducedMotion(true);
    render(<PerolPage />);
    expect(ring()).toHaveAttribute("data-3d", "false");
  });

  it("sem movimento reduzido liga o 3D", () => {
    mockReducedMotion(false);
    render(<PerolPage />);
    expect(ring()).toHaveAttribute("data-3d", "true");
  });

  it("produto sem fotos de cena mostra 'Pendente' em vez de inventar imagem", () => {
    render(<UseRing name="Lavix" gallery={["lx-pack", "lx-close"]} />);
    expect(screen.getByText(/fotos de uso deste produto/)).toHaveClass("pend");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("trocar para Lavix mostra o anel do Lavix", () => {
    render(<PerolPage />);
    fireEvent.click(screen.getByRole("radio", { name: "Lavix" }));
    expect(within(ring()).getAllByRole("img")).toHaveLength(cenas(PRODUCTS.lx.gallery).length);
  });
});
