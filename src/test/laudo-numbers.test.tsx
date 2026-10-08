import { cleanup, render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PerolPage } from "@/components/perol/PerolPage";
import { PRODUCTS } from "@/content/flotador";

const secao = () => document.querySelector<HTMLElement>("#dados")!;

beforeEach(() => window.history.replaceState(null, "", "/"));
afterEach(cleanup);

describe("Números do laudo", () => {
  it("resume quantos dados estão confirmados", () => {
    render(<PerolPage />);
    const confirmados = PRODUCTS.f5.stats.filter((s) => s.real).length;
    expect(secao().querySelector(".dados-sum")).toHaveTextContent(
      `${confirmados} de ${PRODUCTS.f5.stats.length} dados confirmados`,
    );
  });

  it("só o dado confirmado ganha destaque, com a fonte", () => {
    render(<PerolPage />);
    const reais = secao().querySelectorAll(".stat.real");
    expect(reais).toHaveLength(PRODUCTS.f5.stats.filter((s) => s.real).length);
    expect(reais[0]).toHaveTextContent("24");
    expect(reais[0]).toHaveTextContent("Fonte: rótulo do produto");
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

  it("os estudos continuam marcados como documento pendente", () => {
    render(<PerolPage />);
    expect(within(secao()).getAllByText("documento técnico")).toHaveLength(
      PRODUCTS.f5.study.length,
    );
  });
});
