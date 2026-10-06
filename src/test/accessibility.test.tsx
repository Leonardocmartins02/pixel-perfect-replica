import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AdvertorialPage } from "@/components/advertorial/AdvertorialPage";
import { ErrorScreen, NotFoundScreen } from "@/components/ErrorScreens";
import { flotador } from "@/content/flotador";

describe("telas de erro", () => {
  it("página não encontrada está em português", () => {
    render(<NotFoundScreen />);
    expect(screen.getByRole("heading", { level: 1, name: "Página não encontrada" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "/");
    expect(screen.queryByText(/not found|go home/i)).toBeNull();
  });

  it("tela de erro está em português e permite tentar novamente pelo teclado", async () => {
    const user = userEvent.setup();
    let retries = 0;
    render(<ErrorScreen onRetry={() => retries++} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Esta página não carregou" }),
    ).toBeVisible();

    await user.tab();
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(retries).toBe(1);
  });
});

describe("navegação por teclado", () => {
  it("o primeiro Tab vai para 'Pular para o conteúdo' e o link leva ao <main>", async () => {
    const user = userEvent.setup();
    const { container } = render(<AdvertorialPage config={flotador} />);

    await user.tab();
    const skip = screen.getByRole("link", { name: "Pular para o conteúdo" });
    expect(skip).toHaveFocus();
    expect(container.querySelector(skip.getAttribute("href")!)).toBe(
      container.querySelector("main"),
    );
  });

  it("Tab percorre a página inteira, em ordem, até o último controle antes do rodapé", async () => {
    const user = userEvent.setup();
    render(<AdvertorialPage config={flotador} />);

    const visited: Element[] = [];
    for (let i = 0; i < 200; i++) {
      await user.tab();
      const active = document.activeElement!;
      if (active === document.body || visited.includes(active)) break;
      visited.push(active);
    }

    // Ordem do Tab segue a ordem do DOM (nenhum tabindex positivo desvia o foco).
    for (let i = 1; i < visited.length; i++) {
      expect(
        visited[i - 1]!.compareDocumentPosition(visited[i]!) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
    expect(visited[0]).toHaveTextContent("Pular para o conteúdo");
    // O rodapé só tem texto, então o último tab stop é o CTA de encerramento.
    expect(visited.at(-1)).toHaveTextContent("Ver proposta de compra");
  });

  it("perguntas frequentes abrem e fecham com Enter e Espaço", async () => {
    const user = userEvent.setup();
    render(<AdvertorialPage config={flotador} />);
    const trigger = screen.getByRole("button", { name: flotador.faq[0]!.question });

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(" ");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
