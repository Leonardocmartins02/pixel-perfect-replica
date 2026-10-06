/**
 * Telas de "página não encontrada" e de erro, usadas pela rota raiz.
 * Ficam fora de __root.tsx para serem testadas sem montar o roteador.
 * O "Voltar ao início" é um <a> comum: recarrega a página e funciona mesmo
 * quando o roteador está no estado que causou o erro.
 */

const primaryButton =
  "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90";
const secondaryButton =
  "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent";

export function NotFoundScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-7xl font-bold text-foreground" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <a href="/" className={primaryButton}>
            Voltar ao início
          </a>
        </div>
      </div>
    </main>
  );
}

export function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado do nosso lado. Tente novamente ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={onRetry} className={primaryButton}>
            Tentar novamente
          </button>
          <a href="/" className={secondaryButton}>
            Voltar ao início
          </a>
        </div>
      </div>
    </main>
  );
}
