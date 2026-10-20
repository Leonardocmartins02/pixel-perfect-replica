# Perol — F5 Flotador e Lavix

Landing page de **F5 Flotador Universal** e **Lavix Finalizador**, da linha profissional Perol. Uma página só, com troca de produto no topo (`/#flotador` e `/#lavix`), galeria por volume (1 L e 5 L), seleção de kits com preço, guia de uso por ambiente, ficha técnica, comparadores de antes e depois, avaliações com foto de clientes e FAQ.

A versão atual é a **rodada de 14/10** (prévia `Prévia LP atualizado.zip`), já incorporada ao código-fonte: a página principal (`/`) mostra essa versão e continua editável.

A **compra está ligada**: cada kit leva ao checkout da Yampi (loja LP - BRASIL, gateway Appmax), na mesma aba, repassando `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` e `fbclid` da URL da página.

## Stack

TanStack Start v1 (React 19, Vite), TypeScript, Tailwind CSS v4 (tokens em `src/styles.css`), Radix Accordion (shadcn), Vitest + Testing Library. Gerenciador: **bun** (`bun.lock`). Fonte: **Montserrat** (Google Fonts, carregada em `src/routes/__root.tsx`).

## Ver a versão final

```bash
git clone https://github.com/Leonardocmartins02/pixel-perfect-replica.git
cd pixel-perfect-replica
git checkout dev   # até a PR dev → main ser aprovada, a versão final está na dev
bun install
bun run dev
```

Abra o endereço que aparece no terminal (`/` mostra o F5, `/#lavix` mostra o Lavix). No Lovable, a versão aparece depois do merge na `main`.

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
src/content/flotador.ts                    dados: produtos, kits, preços, frete, pagamento, garantia, FAQ, status
src/lib/offer.ts                           regras da oferta (liberação, preço por unidade, BRL)
src/components/perol/PerolPage.tsx         página: estado (produto, volume, kit) e ordem das seções
src/components/perol/sections.tsx          seções e blocos: kits, dúvidas, ficha técnica, vendidos, avaliações, popups
src/components/perol/controls.tsx          seletores (produto, volume, kit), FAQ e navegação dos carrosséis
src/components/perol/ProductGallery.tsx    galeria do topo
src/components/perol/ApplicationsCarousel.tsx  "Encontre o seu ambiente" e o guia rápido de cada ambiente
src/components/advertorial/                componentes anteriores preservados
src/components/ui/                         shadcn/ui
src/routes/index.tsx                       página principal (/)
src/styles.css                             tokens, tema `.perol-page` e estilos da página
src/test/                                  testes
public/img/                                fotos (.webp)
docs/                                      briefing e plano
```

## A página, de cima para baixo

1. **Compra** (`#comprar`): galeria, selo "+ de 7 mil unidades vendidas" (caminhão animado), descrição, selos (ISO 9001 em destaque, validade, linha profissional), seletor de volume, kits e botão de compra.
2. **Faixa de provas**: ISO 9001, 13 divisões, validade e uso.
3. **Dúvidas** (`#duvidas`): cinco objeções, cada uma com foto de cena, resposta e, quando há, um selo verde com o fato de apoio (modo de uso ou custo por litro calculado dos preços).
4. **Kits** (`#kits-final`): cartões de oferta e a garantia, que abre prazos, frete e pagamento.
5. **Divisões** (`#quem-usa`), **Onde usar** (`#onde-usar`), **Antes e depois** (`#antes-depois`), **Como funciona** (`#como-funciona`).
6. **Ficha técnica** (`#dados`), **Avaliações** (`#avaliacoes`: título com as unidades vendidas e "Veja algumas avaliações de quem já comprou", todos os cartões com foto, sem filtro por segmento) e **FAQ** (`#faq`).

Cartões, listas e seções entram com movimento ao rolar (um após o outro) e reagem ao hover no desktop; com "reduzir movimento" ativo, tudo aparece parado.

## Onde editar

Tudo que é conteúdo fica em `src/content/flotador.ts`:

| O que | Onde |
| --- | --- |
| Textos, fotos, dúvidas, ficha técnica e FAQ de cada produto | `PRODUCTS.f5` e `PRODUCTS.lx` |
| Kits (1 un., 2 un., caixa) | `KITS`; o 5 L é derivado em `kitsForVolume` |
| Preço de cada kit, em centavos | `PRICES` (1 L) e `PRICES_5L` (5 L) |
| Preço "de" riscado, que gera o selo de desconto | `COMPARE_PRICES` e `COMPARE_PRICES_5L` |
| Link de compra de cada kit | `CHECKOUT` e `CHECKOUT_5L` |
| Liga ou desliga a compra sem apagar os links | `CHECKOUT_RELEASE.approved` |
| SKU de cada kit (igual ao cadastro na Yampi) | `SKUS` |
| Prazos de entrega, pagamento e garantia | `SHIPPING`, `PAYMENT` e `GUARANTEE_DAYS` |
| Fotos da galeria por volume | `gallery` (1 L) e `gallery5` (5 L) de cada produto |
| Guia rápido de cada ambiente (dose, passos, kit indicado) | `envGuide` de cada produto |
| Avaliações (nome, cidade, data, estrelas, texto, foto) | `F5_REVIEWS` e `LX_REVIEWS`, ligadas em `reviews` de cada produto |
| Unidades vendidas ("+ de 7 mil") | `SOLD`, ligado em `sold` de cada produto |
| Selo verde das dúvidas | `fact` de cada item de `obj` |

Outros pontos:

- Fotos: `public/img/`, sempre `.webp`, citadas pelo nome sem extensão. Avaliações usam `rev-f5-N` e `rev-lx-N`; a dúvida da entrega usa `entrega-caminhao`. As fotos `cliente-N` não são mais usadas na página.
- Layout, fontes e animações: `src/styles.css` e `src/components/perol/`.
- Regras de liberação da compra: `src/lib/offer.ts` (`getOfferReadiness`). O repasse dos parâmetros de campanha para o checkout fica em `withTracking`, no mesmo arquivo.

### Regras do conteúdo

- Preço é inteiro em centavos (`3990` = R$ 39,90). `null` aparece como "R$ ––,––" e marca o bloco como Pendente.
- O desconto é calculado: só aparece quando existe preço "de" maior que o preço do kit.
- No 5 L não existe caixa com 6. O kit maior é a caixa com 2 galões; quem estava na caixa de 1 L e troca para 5 L cai nela.
- Dado que falta fica `null` ou sem o campo e aparece como "Pendente". Não preencher com valor inventado.
- Um ambiente sem `envGuide` continua no carrossel, só não abre o guia.
- Avaliação sem `photo` vira cartão só de texto; hoje todas têm foto. Com `summary: true` o texto aparece como resumo (sem aspas) e com a origem ("Resumo da avaliação no Magalu").
- Os custos por litro citados nas dúvidas são calculados de `PRICES`; mudou o preço, o texto acompanha.
- Todo kit com preço precisa de link HTTPS da Yampi em `CHECKOUT`/`CHECKOUT_5L` (um teste confere). Com `CHECKOUT_RELEASE.approved = false`, o botão volta a avisar que a compra está indisponível.

## Estado atual

Preenchido:

- Preços dos kits de 1 L e 5 L dos dois produtos, com preço "de" nos kits com desconto.
- Frete (3 a 8 dias com seguro, 5 a 15 dias grátis), garantia de 7 dias e pagamento (PIX e cartão, 3x sem juros, até 12x).
- Ficha técnica (diluições, pH, superfícies, embalagens, validade) e guia de uso por ambiente.
- Galerias de 1 L e 5 L do F5 e do galão do Lavix, fotos de cena das dúvidas e pares de antes e depois (marcados como comparação ilustrativa).
- Selo "+ de 7 mil unidades vendidas" no topo e no título das avaliações.
- Avaliações com foto de clientes reais que compraram o produto: 4 do F5 e 6 do Lavix. Guarde a autorização (ou o link da avaliação pública) de cada cliente, porque nome, cidade e foto são dados pessoais (LGPD).
- Selos verdes nas dúvidas (modo de uso e custo por litro na caixa com 6).
- Tipografia em Montserrat em toda a página, inclusive nas ilustrações e no selo de garantia.
- Checkout Yampi nos 10 kits (F5 e Lavix, 1 L e 5 L), liberado em 19/10/2026; faixa "Modelo de referência" removida do topo.

Pendente:

- Vendedor, CNPJ e canal de atendimento no rodapé.
- Dados de laudo citados no FAQ: rendimento por litro do F5 e teste de fixação do Lavix.
- Preço da caixa de 5 L com 6 unidades não existe; os campos `cx6` de `PRICES_5L` e `CHECKOUT_5L` ficam `null`.

Antes de publicar, confirmar com o parceiro a origem do total de unidades vendidas e os prazos e condições comerciais. A página segue com `noindex` e `robots.txt` bloqueando tudo (isso não é controle de acesso). O único destino externo é o checkout da Yampi; a página não tem pixel, analytics, WhatsApp nem coleta de dados.

## Continuidade local

Após o proprietário conectar o GitHub (Lovable → + → GitHub), clone o repositório, rode `bun install` e `bun run dev`. Commits na branch conectada sincronizam com o Lovable.

## Componentes e tema

O shadcn/ui já está configurado em `components.json`, com os componentes no próprio repositório em `src/components/ui/`. A página usa `Button` nas ações e miniaturas, `ToggleGroup` nos produtos, volumes e filtros, `RadioGroup` nos kits, `Carousel` na galeria e nos ambientes, `Accordion` no FAQ, `Slider` nos comparadores, `Popover` nos passos de "Como funciona" e `Dialog` nos popups (garantia, ficha técnica e guia por ambiente, todos pelo `InfoDialog` de `sections.tsx`). Os componentes podem ser personalizados sem clonar o repositório completo do shadcn.

O tema `.perol-page` mapeia a paleta recebida para os tokens semânticos do shadcn (`primary`, `background`, `muted`, `border`, `ring`). A troca para Lavix atualiza a cor de destaque. O token de texto da referência foi renomeado para `--perol-muted`, evitando conflito com a superfície `--muted` do shadcn. Os controles têm foco visível e suporte a teclado.

Referências: [componentes shadcn/ui](https://ui.shadcn.com/docs/components), [tema](https://ui.shadcn.com/docs/theming).

## Branches de trabalho

- `main`: versão estável conectada ao Lovable.
- `dev`: criada a partir da `main`; desenvolvimento e revisão das próximas mudanças.

Trabalhe em `dev`. Envie com `git push -u origin dev` e, quando a versão estiver aprovada, abra uma PR de `dev` para `main`. O envio à `dev` não atualiza a versão da `main` no Lovable. As branches anteriores não foram removidas.

## 21st MCP (antigo Magic MCP)

A conexão de desenvolvimento está preparada em `.codex/config.toml`, usando `https://21st.dev/api/mcp` e a variável de ambiente `API_KEY_21ST`. Não é uma dependência do site e não vai para o código enviado ao navegador.

Para ativar:

1. Entre em [21st.dev/mcp](https://21st.dev/mcp) e gere uma chave atual.
2. Defina `API_KEY_21ST` no ambiente que inicia o Codex. Use as configurações de variáveis de ambiente do Windows, ou o ambiente Linux se estiver executando o Codex no WSL. Não coloque a chave no código, no Git, no chat ou em variáveis `VITE_*`.
3. Abra esta pasta como projeto confiável no Codex e reinicie o cliente para carregar o MCP.
4. Confira `twenty_first` na lista de servidores MCP (`/mcp` ou `codex mcp list`).

A configuração por projeto depende de o Codex abrir a pasta deste repositório. Ela não configura automaticamente um MCP dentro do Lovable.

A conexão ainda precisa de uma chave e de uma chamada real para confirmar autenticação. Depois de conectar, use `search` e `get_component` para selecionar componentes, conferir licença e adaptar ao tema e aos controles existentes. A geração hospedada depende do acesso da conta; não é necessária para manter o site.

Fontes: [migração oficial Magic → 21st](https://github.com/21st-dev/magic-mcp#readme), [MCP no Codex](https://developers.openai.com/codex/mcp).
