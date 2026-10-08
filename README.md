# Perol — F5 Flotador e Lavix

Landing page de **F5 Flotador e Lavix Finalizador**, integrada ao Lovable a partir do arquivo `perol-lp-github.zip`. Inclui galeria, seleção de kits, animações, comparadores e FAQ. Prévia para revisão, **sem compra habilitada**.

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
src/components/perol/            nova página e seções do modelo recebido
src/components/advertorial/      componentes anteriores preservados
src/routes/index.tsx             página principal (/)
src/test/                        testes
docs/                            briefing e plano
```

## Onde editar

- Conteúdo dos dois produtos (`PRODUCTS`), kits (`KITS`), preços (`PRICES`, em centavos) e links (`CHECKOUT`): `src/content/flotador.ts`.
- Fotos do ZIP: `public/img/`.
- Layout, fontes e animações: `src/styles.css` e `src/components/perol/`.
- Link direto do Lavix: `/#lavix`.
- Regras de liberação: `src/lib/offer.ts` (`getOfferReadiness`).

## Modelo recebido

O visual e os textos vieram do ZIP fornecido pelo proprietário. Fotos de antes/depois, depoimentos, logos de clientes, laudos, valores, condições de entrega, garantia e dados do vendedor continuam pendentes. As fotos do modelo mostram galões de 5 L, enquanto os kits descrevem frascos de 1 L; substituir pelas fotos da apresentação comercial antes de lançar.

A importação não libera vendas: preencher uma URL e um preço não contorna `getOfferReadiness`. A configuração de aprovação e apresentação comercial deve ser revisada por produto antes da ativação dos kits.

## Estado atual

- Status `draft`; aprovação comercial desativada; todos os dados comerciais `null`.
- Prévia com `noindex` e `robots.txt` bloqueando tudo (não é controle de acesso).
- Sem checkout, pagamento, frete, WhatsApp, analytics ou coleta de dados.

## Continuidade local

Após o proprietário conectar o GitHub (Lovable → + → GitHub), clone o repositório, rode `bun install` e `bun run dev`. Commits na branch conectada sincronizam com o Lovable.
