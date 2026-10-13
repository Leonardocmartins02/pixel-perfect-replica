# Perol — F5 Flotador e Lavix

Landing page de **F5 Flotador Universal** e **Lavix Finalizador**, da linha profissional Perol. Uma página só, com troca de produto no topo (`/#flotador` e `/#lavix`), galeria por volume (1 L e 5 L), seleção de kits com preço, guia de uso por ambiente, ficha técnica, comparadores de antes e depois e FAQ.

Os preços, prazos, garantia e meios de pagamento já aparecem na página, mas a **compra continua desligada**: sem link de checkout aprovado, o botão "Comprar" só avisa que a compra está indisponível.

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
src/content/flotador.ts                    dados: produtos, kits, preços, frete, pagamento, garantia, FAQ, status
src/lib/offer.ts                           regras da oferta (liberação, preço por unidade, BRL)
src/components/perol/PerolPage.tsx         página: estado (produto, volume, kit) e ordem das seções
src/components/perol/sections.tsx          seções e blocos: kits, dúvidas, ficha técnica, avaliação, popups
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

1. **Compra** (`#comprar`): galeria, avaliação, descrição, seletor de volume, kits e botão de compra.
2. **Faixa de provas**: ISO 9001, 13 divisões, validade e uso.
3. **Dúvidas** (`#duvidas`): cinco objeções, cada uma com foto de cena e resposta.
4. **Kits** (`#kits-final`): cartões de oferta e a garantia, que abre prazos, frete e pagamento.
5. **Divisões** (`#quem-usa`), **Onde usar** (`#onde-usar`), **Antes e depois** (`#antes-depois`), **Como funciona** (`#como-funciona`).
6. **Ficha técnica** (`#dados`), **Avaliações** (`#avaliacoes`) e **FAQ** (`#faq`).

## Onde editar

Tudo que é conteúdo fica em `src/content/flotador.ts`:

| O que | Onde |
| --- | --- |
| Textos, fotos, dúvidas, ficha técnica e FAQ de cada produto | `PRODUCTS.f5` e `PRODUCTS.lx` |
| Kits (1 un., 2 un., caixa) | `KITS`; o 5 L é derivado em `kitsForVolume` |
| Preço de cada kit, em centavos | `PRICES` (1 L) e `PRICES_5L` (5 L) |
| Preço "de" riscado, que gera o selo de desconto | `COMPARE_PRICES` e `COMPARE_PRICES_5L` |
| Link de compra de cada kit | `CHECKOUT` e `CHECKOUT_5L` |
| Prazos de entrega, pagamento e garantia | `SHIPPING`, `PAYMENT` e `GUARANTEE_DAYS` |
| Fotos da galeria por volume | `gallery` (1 L) e `gallery5` (5 L) de cada produto |
| Guia rápido de cada ambiente (dose, passos, kit indicado) | `envGuide` de cada produto |
| Nota, total de avaliações e fotos do rodízio | `rating` de cada produto |

Outros pontos:

- Fotos: `public/img/`, sempre `.webp`, citadas pelo nome sem extensão.
- Layout, fontes e animações: `src/styles.css` e `src/components/perol/`.
- Regras de liberação da compra: `src/lib/offer.ts` (`getOfferReadiness`).

### Regras do conteúdo

- Preço é inteiro em centavos (`3990` = R$ 39,90). `null` aparece como "R$ ––,––" e marca o bloco como Pendente.
- O desconto é calculado: só aparece quando existe preço "de" maior que o preço do kit.
- No 5 L não existe caixa com 6. O kit maior é a caixa com 2 galões; quem estava na caixa de 1 L e troca para 5 L cai nela.
- Dado que falta fica `null` ou sem o campo e aparece como "Pendente". Não preencher com valor inventado.
- Um ambiente sem `envGuide` continua no carrossel, só não abre o guia.

## Estado atual

Preenchido:

- Preços dos kits de 1 L e 5 L dos dois produtos, com preço "de" nos kits com desconto.
- Frete (3 a 8 dias com seguro, 5 a 15 dias grátis), garantia de 7 dias e pagamento (PIX e cartão, 3x sem juros, até 12x).
- Ficha técnica (diluições, pH, superfícies, embalagens, validade) e guia de uso por ambiente.
- Galerias de 1 L e 5 L do F5 e do galão do Lavix, fotos de cena das dúvidas e pares de antes e depois (marcados como comparação ilustrativa).
- Avaliação no topo ("+8 mil avaliações verificadas") com fotos de clientes.

Pendente:

- **Links de checkout**: todos `null`. Com link e preço, a compra ainda depende de `status: "approved"`, aprovação comercial, SKU, volume e unidades por caixa (`getOfferReadiness`).
- Vendedor, CNPJ e canal de atendimento no rodapé.
- Depoimentos: os três cartões seguem como espaço reservado.
- Dados de laudo citados nas dúvidas e no FAQ: % de remoção e rendimento por litro do F5, dose por kg e tempo de fixação do Lavix.
- Preço da caixa de 5 L com 6 unidades não existe; os campos `cx6` de `PRICES_5L` ficam `null`.
- A faixa do topo ainda diz "Modelo de referência"; remover antes de publicar.

Antes de publicar, confirmar com o parceiro a origem do total de avaliações e das fotos de clientes, e os prazos e condições comerciais. A prévia segue com `noindex` e `robots.txt` bloqueando tudo (isso não é controle de acesso). Não há checkout, pixel, analytics, WhatsApp nem coleta de dados.

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
