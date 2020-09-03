export function createVNode(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'object'
          ? child
          : createTextElement(child)
      ),
    },
    component: null,
    dom: null,
    parentDom: null,
  }
}

function createTextElement(value) {
  return {
    type: 'TEXT',
    props: {
      nodeValue: value,
      children: [],
    },
    component: null,
    dom: null,
    parentDom: null,
  }
}
