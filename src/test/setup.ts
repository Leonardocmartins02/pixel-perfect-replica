import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Embla (carrosséis) observa tamanho e visibilidade; o jsdom não tem nenhum dos dois.
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
for (const name of ["ResizeObserver", "IntersectionObserver"] as const) {
  if (!(name in window))
    Object.defineProperty(window, name, {
      writable: true,
      configurable: true,
      value: ObserverStub,
    });
}
