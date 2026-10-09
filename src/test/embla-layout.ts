import { vi } from "vitest";

// O jsdom devolve medidas zeradas e o Embla não acharia nenhum snap. Simulamos um viewport de
// 300px (o trilho tem a largura do viewport; os slides transbordam) com slides de 264px e 12px de espaço (o Embla lê offset* nos nós e getBoundingClientRect
// no viewport).
const isSlide = (el: Element) => el.getAttribute("aria-roledescription") === "slide";
const slideLeft = (el: Element) => [...el.parentElement!.children].indexOf(el) * 276;
export function mockEmblaLayout() {
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
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
    this: HTMLElement,
  ) {
    return isSlide(this) ? 264 : 300;
  });
  vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(function (
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
