import { createFileRoute } from "@tanstack/react-router";
import { PerolPage } from "@/components/perol/PerolPage";

const title = "Perol — F5 Flotador e Lavix Finalizador";
const description =
  "Conheça F5 Flotador e Lavix Finalizador, da linha profissional Perol. Prévia em validação.";

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
  component: PerolPage,
});
