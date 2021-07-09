import { __ } from './message';

export function localizeHTML() {
  document.body.innerHTML = document.body.innerHTML.replace(
    /__MSG_(\w+)__/g,
    (name, key) => __(key, name),
  );
}

type ChildNode = Node | string | number | undefined | null | boolean;

export function newElem<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props?: { className?: string; children?: ChildNode | ChildNode[] },
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tagName);
  if (props?.children) {
    if (Array.isArray(props.children)) {
      props.children.forEach(c => appendChild(e, c));
    } else {
      appendChild(e, props.children);
    }
  }
  if (props?.className) {
    e.className = props.className;
  }
  return e;
}

function appendChild(parent: HTMLElement, child: ChildNode) {
  if (child == undefined || typeof child === 'boolean') {
    return;
  }
  parent.appendChild(
    typeof child === 'string'
      ? document.createTextNode(child)
      : typeof child === 'number'
      ? document.createTextNode(`${child}`)
      : child,
  );
}
