import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PerolPage } from "@/components/perol/PerolPage";
import { PRODUCTS } from "@/content/flotador";

// O jsdom devolve medidas zeradas e o Embla não acharia nenhum snap. Simulamos um viewport de
// 300px (o trilho tem a largura do viewport; os slides transbordam) com slides de 264px e 12px de espaço (o Embla lê offset* nos nós e getBoundingClientRect
// no viewport).
const isSlide = (el: Element) => el.getAttribute("aria-roledescription") === "slide";
const slideLeft = (el: Element) => [...el.parentElement!.children].indexOf(el) * 276;
function mockLayout() {
  // Sem CSS carregado, a margem calculada vem vazia (NaN) e o Embla descarta todos os snaps.
  const original = window.getComputedStyle.bind(window);
  vi.spyOn(window, "getComputedStyle").mockImplementation((el, pseudo) => {
    const style = original(el, pseudo);
    const getPropertyValue = style.getPropertyValue.bind(style);
    style.getPropertyValue = (name: string) =>
      name.startsWith("margin-") ? "0px" : getPropertyValue(name);
    return style;
  });
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isSlide(this) ? 264 : 300;
  });
  vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isSlide(this) ? slideLeft(this) : 0;
  });
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const left = isSlide(this) ? slideLeft(this) : 0;
    const width = isSlide(this) ? 264 : 300;
    return {
      left,
      right: left + width,
      top: 0,
      bottom: 300,
      width,
      height: 300,
      x: left,
      y: 0,
    } as DOMRect;
  });
}

const mainImg = () => document.querySelector<HTMLElement>("#mainImg")!;
const counter = () => document.querySelector("#imgCount")!.textContent;

beforeEach(() => {
  window.history.replaceState(null, "", "/");
  mockLayout();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Galeria do topo (Embla)", () => {
  it("renderiza todas as fotos com alt e começa em 1 / N", () => {
    render(<PerolPage />);
    const total = PRODUCTS.f5.gallery.length;
    PRODUCTS.f5.gallery.forEach((_, i) => {
      expect(
        within(mainImg()).getByRole("img", { name: `${PRODUCTS.f5.name}, foto ${i + 1}` }),
      ).toBeInTheDocument();
    });
    expect(counter()).toBe(`1 / ${total}`);
  });

  it("clicar na miniatura muda o contador e o aria-current", () => {
    render(<PerolPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ver foto 4" }));
    expect(counter()).toBe(`4 / ${PRODUCTS.f5.gallery.length}`);
    expect(screen.getByRole("button", { name: "Ver foto 4" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("button", { name: "Ver foto 1" })).toHaveAttribute(
      "aria-current",
      "false",
    );
  });

  it("as setas do teclado avançam e voltam", () => {
    render(<PerolPage />);
    fireEvent.keyDown(mainImg(), { key: "ArrowRight" });
    expect(counter()).toBe(`2 / ${PRODUCTS.f5.gallery.length}`);
    fireEvent.keyDown(mainImg(), { key: "ArrowLeft" });
    expect(counter()).toBe(`1 / ${PRODUCTS.f5.gallery.length}`);
  });

  it("trocar para Lavix volta para 1 / N do Lavix", () => {
    render(<PerolPage />);
    fireEvent.click(screen.getByRole("button", { name: "Ver foto 3" }));
    fireEvent.click(screen.getByRole("radio", { name: "Lavix" }));
    expect(counter()).toBe(`1 / ${PRODUCTS.lx.gallery.length}`);
    expect(screen.getByRole("button", { name: "Ver foto 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      within(mainImg()).getByRole("img", { name: `${PRODUCTS.lx.name}, foto 1` }),
    ).toBeInTheDocument();
  });

  it("expõe a semântica de carrossel", () => {
    render(<PerolPage />);
    expect(mainImg()).toHaveAttribute("aria-roledescription", "carousel");
    expect(mainImg()).toHaveAccessibleName(`Fotos de ${PRODUCTS.f5.name}`);
    const slides = within(mainImg()).getAllByRole("group");
    expect(slides).toHaveLength(PRODUCTS.f5.gallery.length);
    expect(slides[0]).toHaveAttribute("aria-roledescription", "slide");
    expect(slides[0]).toHaveAccessibleName(`1 de ${PRODUCTS.f5.gallery.length}`);
    expect(screen.getByRole("button", { name: "Foto anterior" })).toBeDisabled();
  });

  it("só a foto atual e a seguinte carregam já", () => {
    render(<PerolPage />);
    const imgs = within(mainImg()).getAllByRole("img");
    expect(imgs.map((el) => el.getAttribute("loading")).slice(0, 4)).toEqual([
      "eager",
      "eager",
      "lazy",
      "lazy",
    ]);
  });
});
