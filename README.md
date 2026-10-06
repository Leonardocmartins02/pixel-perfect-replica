# perol-flotador-adv

Advertorial de um único produto — **Flotador Perol**, vendido por caixa. Protótipo para revisão interna: **não publicado e sem compra habilitada**.

## Stack
TanStack Start v1 (React 19, Vite), TypeScript, Tailwind CSS v4 (tokens em `src/styles.css`), Radix Accordion (shadcn), Vitest + Testing Library. Gerenciador: **bun** (`bun.lock`).

## Executar
Pré-requisitos: Bun ≥ 1.1 (ou Node 20+ com bun instalado).

```bash
bun install
bun run dev        # desenvolvimento
bun run build      # build de produção
bun run lint       # ESLint
bun run test       # Vitest
bunx tsc --noEmit  # tipos
```

## Organização
```text
src/content/flotador.ts          dados: produto, editorial, mídia, oferta, vendedor, FAQ, status
src/lib/offer.ts                 regras da oferta (liberação, preço por unidade, BRL)
src/components/advertorial/      seções da página
src/routes/index.tsx             página principal (/)
src/test/                        testes
docs/                            briefing e plano
```

## Onde editar
- Conteúdo, preço (em centavos), quantidade, URL de compra: `src/content/flotador.ts`.
- Regras de liberação: `src/lib/offer.ts` (`getOfferReadiness`).

## Estado atual
- Status `draft`; aprovação comercial desativada; todos os dados comerciais `null`.
- Prévia com `noindex` e `robots.txt` bloqueando tudo (não é controle de acesso).
- Sem checkout, pagamento, frete, WhatsApp, analytics ou coleta de dados.

## Continuidade local
Após o proprietário conectar o GitHub (Lovable → + → GitHub), clone o repositório, rode `bun install` e `bun run dev`. Commits na branch conectada sincronizam com o Lovable.
