import { Fragment } from "./component"

export function createVNode(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children
      : children.length === 1
        ? typeof children[0] === 'object' ? children[0] : createTextVNode(children[0])
        : children.map(child => typeof child === 'object' ? child : createTextVNode(child)),
    },
    component: null,
    dom: null,
    parentDom: null,
    children: null,
  }
}

function createTextVNode(value) {
  return {
    type: 'TEXT',
    props: {
      nodeValue: value,
      children: [],
    },
    dom: null,
    parentDom: null,
  }
}
