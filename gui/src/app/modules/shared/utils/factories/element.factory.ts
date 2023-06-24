interface ElementFactoryParams {
  tag: string;
  name?: string;
  parent?: HTMLElement;
  classes?: string[];
  style?: Partial<CSSStyleDeclaration>;
  attributes?: { [key: string]: string };
  events?: { [key: string]: EventListener };
  children?: HTMLElement[];
  innerText?: string;
}

function ElementFactory(params: ElementFactoryParams) {
  const element = document.createElement(params.tag);

  function _getClass(parent: HTMLElement, name: string) {
    return parent ? `${parent.classList[0]}_${name}` : name;
  }

  function _getId(parent: HTMLElement, name: string) {
    return parent && parent.id ? `${parent.id}_${name}` : name;
  }

  if (params.name && params.parent) {
    element.classList.add(_getClass(params.parent, params.name));
    element.id = _getId(params.parent, params.name);
  }

  if (params.classes) {
    element.classList.add(...params.classes);
  }

  if (params.style) {
    for (const key in params.style) {
      element.style[key] = params.style[key] as string;
    }
  }

  if (params.attributes) {
    for (const key in params.attributes) {
      element.setAttribute(key, params.attributes[key]);
    }
  }

  if (params.events) {
    for (const key in params.events) {
      element.addEventListener(key, params.events[key]);
    }
  }

  if (params.children) {
    element.append(...params.children);
  }

  if (params.innerText) {
    element.innerText = params.innerText;
  }

  return element;
}

export { ElementFactory }