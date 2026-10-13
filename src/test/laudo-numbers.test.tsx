import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PerolPage } from "@/components/perol/PerolPage";
import { PRODUCTS } from "@/content/flotador";

const secao = () => document.querySelector<HTMLElement>("#dados")!;

beforeEach(() => window.history.replaceState(null, "", "/"));
afterEach(cleanup);

describe("Números da ficha técnica", () => {
  it("resume quantos dados estão confirmados", () => {
    render(<PerolPage />);
    const confirmados = PRODUCTS.f5.stats.filter((s) => s.real).length;
    expect(secao().querySelector(".dados-sum")).toHaveTextContent(
      `${confirmados} de ${PRODUCTS.f5.stats.length} dados confirmados`,
    );
  });

  it("o dado em destaque ganha o número grande, com a fonte", () => {
    render(<PerolPage />);
    const reais = secao().querySelectorAll(".stat.real");
    expect(reais).toHaveLength(PRODUCTS.f5.stats.filter((s) => s.real && s.hero).length);
    expect(reais[0]).toHaveTextContent("24");
    expect(reais[0]).toHaveTextContent("Fonte: rótulo do produto");
  });

  it("os demais dados confirmados abrem a explicação num popup", async () => {
    const user = userEvent.setup();
    render(<PerolPage />);
    const specs = PRODUCTS.f5.stats.filter((s) => s.real && !s.hero);
    expect(secao().querySelectorAll(".stat.spec")).toHaveLength(specs.length);
    await user.click(within(secao()).getByRole("button", { name: /100 ml 1:10/ }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("Fonte: ficha técnica Perol");
    expect(dialog).toHaveTextContent(specs[0]!.info!);
  });

  it("dados sem laudo viram campos 'Pendente', sem medidor nem número inventado", () => {
    render(<PerolPage />);
    const pendentes = secao().querySelectorAll(".stat.wait");
    expect(pendentes).toHaveLength(PRODUCTS.f5.stats.filter((s) => !s.real).length);
    for (const item of pendentes) {
      expect(within(item as HTMLElement).getByText(/laudo|rendimento|ficha/i)).toHaveClass("pend");
      // o valor é sempre um espaço reservado ("—"), nunca um número
      expect(item.querySelector(".v")).toHaveTextContent("—");
    }
    expect(secao().querySelector(".gauge")).toBeNull();
  });

  it("cada cartão da ficha técnica abre a tabela completa", async () => {
    const user = userEvent.setup();
    render(<PerolPage />);
    expect(secao().querySelectorAll(".study-card")).toHaveLength(PRODUCTS.f5.study.length);
    await user.click(within(secao()).getByRole("button", { name: /Uso e diluição/ }));
    const dialog = await screen.findByRole("dialog", { name: "Uso e diluição" });
    expect(within(dialog).getAllByRole("term")).toHaveLength(PRODUCTS.f5.study[0]!.details.length);
    expect(dialog).toHaveTextContent("Limpador flotador multiuso (APC)");
  });
});
