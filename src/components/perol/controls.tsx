import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { KITS, type KitId, type ProductContent, type ProductId } from "@/content/flotador";
import { KitOption, Pending } from "./sections";

export function ProductSelector({
  value,
  onChange,
}: {
  value: ProductId;
  onChange: (value: ProductId) => void;
}) {
  return (
    <ToggleGroup
      className="switch"
      type="single"
      value={value}
      aria-label="Escolher produto"
      onValueChange={(next) => {
        if (next === "f5" || next === "lx") onChange(next);
      }}
    >
      <ToggleGroupItem value="f5" data-p="f5">
        <i aria-hidden="true" />
        F5 Flotador
      </ToggleGroupItem>
      <ToggleGroupItem value="lx" data-p="lx">
        <i aria-hidden="true" />
        Lavix
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function KitSelector({
  value,
  productId,
  onChange,
}: {
  value: KitId;
  productId: ProductId;
  onChange: (value: KitId) => void;
}) {
  return (
    <RadioGroup
      className="kits"
      id="kits"
      aria-label="Kit"
      value={value}
      onValueChange={(next) => {
        if (next === "u1" || next === "u2" || next === "cx6") onChange(next);
      }}
    >
      {KITS.map((item) => (
        <KitOption key={item.id} item={item} productId={productId} />
      ))}
    </RadioGroup>
  );
}

export function ProductFaq({ product }: { product: ProductContent }) {
  return (
    <Accordion type="multiple" defaultValue={["faq-0"]} id="faqList" className="swap">
      {product.faq.map((item, index) => (
        <AccordionItem key={item.q} value={`faq-${index}`} className="perol-faq-item">
          <AccordionTrigger className="perol-faq-trigger">{item.q}</AccordionTrigger>
          <AccordionContent className="perol-faq-answer">
            {item.a ? <span>{item.a}</span> : <Pending>{item.p}</Pending>}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ReviewFilter({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      className="filters"
      id="filters"
      aria-label="Filtrar avaliações por segmento"
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next);
      }}
    >
      {items.map((label) => (
        <ToggleGroupItem key={label} value={label}>
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
