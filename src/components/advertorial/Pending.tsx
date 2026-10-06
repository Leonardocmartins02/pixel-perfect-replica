import type { ReactNode } from "react";

/** Marca conteúdo ausente na prévia interna. Nunca aparenta informação aprovada. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <p className="pending" role="note">
      <span className="pending-tag">Pendente</span>
      <span>{children}</span>
    </p>
  );
}

export function MediaPlaceholder({ label, ratio = "4 / 3" }: { label: string; ratio?: string }) {
  return (
    <div className="media-placeholder" style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      <span className="pending-tag">Pendente</span>
      <span className="mt-2 max-w-[28ch] text-center text-sm">{label}</span>
    </div>
  );
}
