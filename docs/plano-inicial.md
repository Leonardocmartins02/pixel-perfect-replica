# Plano inicial

## Implementado
1. Configuração tipada central (`src/content/flotador.ts`) com dados ausentes como `null`.
2. Regras da oferta (`src/lib/offer.ts`): liberação, preço por unidade, formatação BRL.
3. Página completa: cabeçalho, abertura, contexto, produto, demonstração, oferta, FAQ, encerramento, rodapé.
4. Estado de rascunho visível; compra bloqueada; prévia não indexável.
5. Testes de renderização, link da oferta, bloqueio de compra e regras de preço.

## Pendente (depende do parceiro)
Ver `docs/briefing.md`.

## Bloqueado
- Botão de compra real — aguarda preço, quantidade, SKU, URL HTTPS e aprovação.
- Seção de entrega — aguarda confirmação dos Correios.

## Critérios de aceite
- Um único H1; links internos levam a seções reais.
- Compra indisponível enquanto `getOfferReadiness().enabled` for falso.
- Sem rolagem horizontal em 320, 375, 768, 1440 px; foco visível.
- Lint, tipos, testes e build passando.

## Próximo passo recomendado
Receber do parceiro SKU, volume, unidades por caixa e fotos reais; preencher `flotador.ts` e revisar a seção de produto.
