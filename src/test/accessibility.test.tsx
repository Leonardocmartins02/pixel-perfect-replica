import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AdvertorialPage } from "@/components/advertorial/AdvertorialPage";
import { ErrorScreen, NotFoundScreen } from "@/components/ErrorScreens";
import { flotador } from "@/content/flotador";

/** Aperta Tab até o foco voltar ao body ou repetir; devolve os elementos visitados, em ordem. */
async function tabThroughPage(user: ReturnType<typeof userEvent.setup>) {
  const visited: Element[] = [];
  for (let i = 0; i < 200; i++) {
    await user.tab();
    const active = document.activeElement;
    if (!active || active === document.body || visited.includes(active)) break;
    visited.push(active);
  }
  return visited;
}

describe("telas de erro", () => {
  it("página não encontrada está em português", () => {
    render(<NotFoundScreen />);
    expect(screen.getByRole("heading", { level: 1, name: "Página não encontrada" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "/");
    expect(screen.queryByText(/not found|go home/i)).toBeNull();
  });

  it("tela de erro está em português e 'Tentar novamente' funciona pelo teclado", async () => {
    const user = userEvent.setup();
    let retries = 0;
    render(<ErrorScreen onRetry={() => retries++} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Esta página não carregou" }),
    ).toBeVisible();
    expect(screen.queryByText(/try again|go home/i)).toBeNull();

    await user.tab();
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(retries).toBe(1);
  });
});

describe("navegação por teclado", () => {
  it("o primeiro Tab vai para 'Pular para o conteúdo', que aponta para o <main>", async () => {
    const user = userEvent.setup();
    const { container } = render(<AdvertorialPage config={flotador} />);

    await user.tab();
    const skip = screen.getByRole("link", { name: "Pular para o conteúdo" });
    expect(skip).toHaveFocus();
    expect(container.querySelector(skip.getAttribute("href")!)).toBe(
      container.querySelector("main"),
    );
  });

  it("Tab percorre a página na ordem do DOM até o último controle", async () => {
    const user = userEvent.setup();
    render(<AdvertorialPage config={flotador} />);

    const visited = await tabThroughPage(user);

    // Nenhum tabindex positivo desvia o foco da ordem de leitura.
    visited.slice(1).forEach((el, i) => {
      expect(
        visited[i]!.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });
    expect(visited[0]).toHaveTextContent("Pular para o conteúdo");
    // O rodapé só tem texto; o último controle da página é o CTA do encerramento.
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
