import type { FlotadorConfig } from "@/content/flotador";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Pending } from "./Pending";

type P = { config: FlotadorConfig };

export function Faq({ config }: P) {
  return (
    <section id="perguntas" aria-labelledby="faq-t" className="section">
      <div className="container-read">
        <h2 id="faq-t" className="section-title">Perguntas frequentes</h2>
        <Accordion type="multiple" className="mt-4">
          {config.faq.map((item, i) => (
            <AccordionItem key={item.question} value={`q${i}`}>
              <AccordionTrigger className="faq-trigger">{item.question}</AccordionTrigger>
              <AccordionContent>
                {item.answer ? <p className="prose-body">{item.answer}</p> : <Pending>Resposta aguardando validação.</Pending>}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function Closing({ config }: P) {
  return (
    <section aria-labelledby="fim-t" className="section section-tint">
      <div className="container-read">
        <h2 id="fim-t" className="section-title">Em resumo</h2>
        <p className="prose-body">{config.editorial.closing}</p>
        <a href="#oferta" className="link-cta mt-6">Ver proposta de compra</a>
      </div>
    </section>
  );
}

export function SiteFooter({ config }: P) {
  const { seller } = config;
  return (
    <footer className="border-t border-border py-10">
      <div className="container-read space-y-4 text-sm text-muted-foreground">
        <p>
          Conteúdo publicitário de revenda independente. Perol é marca de seu respectivo titular; esta página não é a loja oficial da marca.
        </p>
        <div>
          <p className="font-semibold text-foreground">Vendedor e atendimento</p>
          {seller.companyName ? (
            <p>{seller.companyName}{seller.taxId ? ` · ${seller.taxId}` : ""}</p>
          ) : (
            <Pending>Dados da empresa vendedora.</Pending>
          )}
          {seller.supportChannel ? <p>{seller.supportChannel}</p> : <Pending>Canal de atendimento.</Pending>}
        </div>
      </div>
    </footer>
  );
}
