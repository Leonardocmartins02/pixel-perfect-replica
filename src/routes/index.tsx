import { createFileRoute } from "@tanstack/react-router";
import { AdvertorialPage } from "@/components/advertorial/AdvertorialPage";
import { flotador } from "@/content/flotador";

const title = "Flotador Perol — proposta de compra por caixa";
const description = "Conheça o Flotador Perol e a proposta de compra por caixa. Prévia em validação.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AdvertorialPage config={flotador} />,
});
