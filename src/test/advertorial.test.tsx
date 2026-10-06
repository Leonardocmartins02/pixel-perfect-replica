import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdvertorialPage } from "@/components/advertorial/AdvertorialPage";
import { flotador } from "@/content/flotador";

describe("AdvertorialPage", () => {
  it("renderiza um único H1 com o título", () => {
    render(<AdvertorialPage config={flotador} />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Conheça o Flotador Perol e a proposta de compra por caixa");
  });

  it("link 'Ver proposta de compra' aponta para a seção da oferta existente", () => {
    const { container } = render(<AdvertorialPage config={flotador} />);
    const links = screen.getAllByRole("link", { name: "Ver proposta de compra" });
    links.forEach((l) => expect(l).toHaveAttribute("href", "#oferta"));
    expect(container.querySelector("#oferta")).not.toBeNull();
  });

  it("compra indisponível e sem preço com dados pendentes", () => {
    render(<AdvertorialPage config={flotador} />);
    expect(screen.getByRole("button", { name: "Compra ainda não liberada" })).toBeDisabled();
    expect(screen.queryByRole("link", { name: "Comprar caixa" })).toBeNull();
    expect(screen.getByTestId("box-price")).not.toHaveTextContent("R$");
    expect(screen.getByText("Prévia interna — conteúdo em validação")).toBeInTheDocument();
  });

  it("hero não mostra preço nem foto sem aprovação", () => {
    render(<AdvertorialPage config={flotador} />);
    const hero = screen.getByRole("region", { name: flotador.editorial.h1 });
    expect(hero).toHaveTextContent("Preço pendente");
    expect(hero).not.toHaveTextContent("R$");
    expect(
      screen.getByRole("img", { name: "Imagem real e autorizada do Flotador Perol" }),
    ).toBeInTheDocument();
  });
});
