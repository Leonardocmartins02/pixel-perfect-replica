import type { FlotadorConfig } from "@/content/flotador";
import { BuyerContext, Demonstration, DraftBanner, Hero, ProductSection } from "./Sections";
import { OfferSection } from "./OfferSection";
import { Closing, Faq, SiteFooter } from "./FaqAndFooter";

export function AdvertorialPage({ config }: { config: FlotadorConfig }) {
  return (
    <>
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <DraftBanner config={config} />
      <main id="conteudo">
        <Hero config={config} />
        <BuyerContext config={config} />
        <ProductSection config={config} />
        <Demonstration config={config} />
        <OfferSection config={config} />
        <Faq config={config} />
        <Closing config={config} />
      </main>
      <SiteFooter config={config} />
    </>
  );
}
