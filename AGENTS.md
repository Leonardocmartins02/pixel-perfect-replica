<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

# AGENTS

## Context and scope

Landing page for F5 Flotador and Lavix Finalizador, with unit, two-unit and six-unit kit selectors, following the owner-supplied perol-lp-github.zip reference. Not a store. Do not expand scope (catalog, cart, login, DB, admin, payments, CRM, blog, analytics).

## Responsibilities

- Leonardo: development, UI/UX, integrations, technical QA.
- Partner: product, audience, technical content, media, price, box composition, commercial terms, logistics, purchase destination.
- Both: approve the published version.

## Content and safety rules

- Never invent commercial or technical data (results, dilutions, claims, reviews, seals, stock, discounts, urgency, deadlines, free shipping, official-store status). Missing data stays `null`/empty and renders as "Pendente".
- No fake press branding or fictitious authors. Always label as advertising.
- No secrets in code; no supplier costs/margins in the frontend.
- No checkout, payment, Correios API, WhatsApp with fake numbers, pixels, or personal data collection until approved.

## Conventions

- All product/offer data lives in `src/content/flotador.ts` (including PRODUCTS, KITS, PRICES and CHECKOUT) — single typed module so content is separate from presentation.
- Offer enablement is decided only by `getOfferReadiness` in `src/lib/offer.ts` — keeps the release gate testable in one place.
- Money is stored in integer cents and formatted as BRL at render — avoids float errors.
- Styles use tokens/utilities in `src/styles.css`; no hardcoded colors in components — consistent theming.
- Test fixtures with fake data stay inside test files — must never leak into page content.

## Done checklist

`bun run lint`, `bunx tsc --noEmit`, `bun run test`, `bun run build` pass; page checked at 320/375/768/1440 px with no horizontal overflow; keyboard focus visible.

## Branch and UI workflow

- Develop on `dev`, created from `main`. Keep `main` as the stable Lovable branch; merge reviewed changes through a PR. Do not delete older branches without a specific request.
- Reuse shadcn components in `src/components/ui/` for interactive controls. Page compositions live in `src/components/perol/controls.tsx`; preserve keyboard interaction and accessible names.
- Map brand colors through the scoped `.perol-page` semantic theme. `--muted` is a surface color; use `--muted-foreground` for subdued text.
- The project-scoped 21st MCP connection reads `API_KEY_21ST` from the Codex environment. It is a development tool, not a browser dependency. Do not report it as connected until a tool call succeeds.
- When 21st is available, search for focused component references and adapt them to the existing shadcn primitives, palette and reduced-motion behavior. Do not publish components or buy generation credits without explicit instruction.
