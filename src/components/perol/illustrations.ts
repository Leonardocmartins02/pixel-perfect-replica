import type { ProductContent, ProductId } from "@/content/flotador";
export const ICONS: Record<string, string> = {
  tile: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect class="draw" style="--len:150" x="7" y="7" width="34" height="34" rx="3"/><path class="draw" style="--len:70" d="M7 24h34M24 7v34"/></svg>',
  porc: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:160" d="M4 34l20-12 20 12-20 9z"/><path class="draw" style="--len:60" d="M14 28l20 12M34 28l-20 12"/><path d="M30 6l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="currentColor" stroke="none"/></svg>',
  granite:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect class="draw" style="--len:150" x="6" y="9" width="36" height="30" rx="4"/><g fill="currentColor" stroke="none"><circle cx="14" cy="17" r="1.6"/><circle cx="24" cy="21" r="2.2"/><circle cx="33" cy="16" r="1.3"/><circle cx="17" cy="30" r="1.9"/><circle cx="30" cy="31" r="1.5"/><circle cx="36" cy="25" r="1.1"/></g></svg>',
  steel:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:140" d="M6 18h36v14a6 6 0 01-6 6H12a6 6 0 01-6-6z"/><path class="draw" style="--len:60" d="M12 24l6-6M20 30l12-12"/><path class="draw" style="--len:40" d="M30 18V10h6"/></svg>',
  glass:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect class="draw" style="--len:160" x="8" y="6" width="32" height="36" rx="2"/><path class="draw" style="--len:60" d="M14 20l8-8M14 30l16-16"/></svg>',
  bath: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:120" d="M6 24h36v6a8 8 0 01-8 8H14a8 8 0 01-8-8z"/><path class="draw" style="--len:60" d="M12 24V11a4 4 0 018 0"/><path d="M18 15v3M21 16v3" stroke-linecap="round"/></svg>',
  hotel:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:180" d="M8 42V10l16-5v37M24 16h16v26M4 42h40"/><path d="M13 16h4M13 24h4M13 32h4M30 24h4M30 32h4" stroke-linecap="round"/></svg>',
  hosp: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect class="draw" style="--len:160" x="7" y="10" width="34" height="32" rx="3"/><path class="draw" style="--len:50" d="M24 18v14M17 25h14" stroke-width="3" stroke-linecap="round"/></svg>',
  school:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:120" d="M4 18L24 8l20 10-20 10z"/><path class="draw" style="--len:80" d="M12 22v10c0 3 5 6 12 6s12-3 12-6V22"/></svg>',
  ind: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:200" d="M5 42V22l10 6v-6l10 6v-6l10 6V8h7v34z"/><path d="M12 36h4M22 36h4" stroke-linecap="round"/></svg>',
  kitchen:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:120" d="M10 22a14 9 0 0028 0z"/><path class="draw" style="--len:60" d="M24 6c-3 4 3 6 0 10M17 9c-2 3 2 4 0 7M31 9c-2 3 2 4 0 7"/><path d="M6 22h36" stroke-linecap="round"/></svg>',
  condo:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:180" d="M6 42V18l18-12 18 12v24z"/><path d="M19 42V30h10v12M14 22h4M30 22h4" stroke-linecap="round"/></svg>',
  cotton:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><circle class="draw" style="--len:60" cx="18" cy="18" r="8"/><circle class="draw" style="--len:60" cx="30" cy="18" r="8"/><circle class="draw" style="--len:60" cx="24" cy="27" r="8"/><path d="M24 35v9" stroke-linecap="round"/></svg>',
  sheet:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:160" d="M6 30h36v8H6zM10 30V18a4 4 0 014-4h20a4 4 0 014 4v12"/><rect x="14" y="20" width="8" height="5" rx="2"/></svg>',
  towel:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:160" d="M8 14h32v8H8zM8 22h32v8H8zM8 30h32v8H8z"/></svg>',
  uniform:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:200" d="M17 6l7 5 7-5 10 6-4 9-4-2v23H15V19l-4 2-4-9z"/></svg>',
  pillow:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:160" d="M8 14c6 2 26 2 32 0 2 6 2 14 0 20-6-2-26-2-32 0-2-6-2-14 0-20z"/></svg>',
  laundry:
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect class="draw" style="--len:170" x="8" y="5" width="32" height="38" rx="3"/><circle class="draw" style="--len:80" cx="24" cy="26" r="10"/><path d="M13 11h4M33 11h.01" stroke-linecap="round"/></svg>',
  home: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><path class="draw" style="--len:160" d="M6 22L24 7l18 15v20H6z"/><path d="M19 42V30h10v12"/></svg>',
};

export function mechanismSvg(p: ProductContent, cur: ProductId) {
  const L = p.mechLabels,
    acc = cur === "f5" ? "#3FB2EA" : "#B39AE6",
    xs = [60, 130, 200, 270, 340, 410, 480];
  let body = "";
  if (cur === "f5") {
    body += `<rect x="0" y="262" width="560" height="68" fill="#1E3A78"/>${xs.map((x) => `<line x1="${x + 35}" y1="262" x2="${x + 35}" y2="330" stroke="#2C4B8E" stroke-width="2"/>`).join("")}`;
    body += xs
      .map((x, i) => {
        const d = (i * 0.35).toFixed(2);
        const arms = [0, 60, 120, 180, 240, 300]
          .map((a) => {
            const r = (a * Math.PI) / 180,
              x1 = x + Math.cos(r) * 13,
              y1 = 246 + Math.sin(r) * 13,
              x2 = x + Math.cos(r) * 24,
              y2 = 246 + Math.sin(r) * 24;
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${acc}" stroke-width="2"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="3.6" fill="${acc}"/>`;
          })
          .join("");
        return `<g class="particle" style="animation-delay:${d}s"><circle cx="${x}" cy="246" r="9" fill="#8A6A3A"/><circle cx="${x + 6}" cy="243" r="4" fill="#A9864F"/></g><g class="mic" style="animation-delay:${d}s">${arms}</g>`;
      })
      .join("");
    body += `<g class="wipe"><rect x="0" y="120" width="120" height="44" rx="10" fill="#fff" opacity=".92"/><text x="60" y="147" text-anchor="middle" fill="#13306B" style="font:800 13px Figtree,sans-serif">${L[3].toUpperCase()}</text></g>`;
  } else {
    body += `<rect x="0" y="228" width="560" height="102" fill="#1E3A78"/>${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${236 + i * 7} Q140 ${229 + i * 7} 280 ${236 + i * 7} T560 ${236 + i * 7}" fill="none" stroke="#2C4B8E" stroke-width="2"/>`).join("")}`;
    body += xs
      .map((x, i) => {
        const d = (i * 0.35).toFixed(2);
        return `<g class="mic-lx" style="animation-delay:${d}s"><path d="M${x} 186 q8 -10 0 -20 q-8 -10 0 -20" fill="none" stroke="${acc}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x}" cy="196" r="5" fill="${acc}"/></g>`;
      })
      .join("");
  }
  return `<svg viewBox="0 0 560 330" role="img" aria-label="Animação de como o ${p.short} age">
    <rect width="560" height="330" fill="#0B1F4A"/>
    ${Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 37 + 12) % 560}" cy="${30 + ((i * 53) % 150)}" r="${1 + (i % 3)}" fill="#fff" opacity=".12"/>`).join("")}
    ${body}
    <g style="font:600 11px 'IBM Plex Mono',monospace;letter-spacing:1px" fill="#BFD3FF">
      <text x="16" y="318">${L[0].toUpperCase()}</text>
      <text x="16" y="28"><tspan fill="${acc}">●</tspan> ${L[2].toUpperCase()}</text>
      ${cur === "f5" ? `<text x="544" y="28" text-anchor="end"><tspan fill="#A9864F">●</tspan> ${L[1].toUpperCase()}</text>` : `<text x="544" y="28" text-anchor="end">${L[1].toUpperCase()} ≈</text>`}
    </g></svg>`;
}
