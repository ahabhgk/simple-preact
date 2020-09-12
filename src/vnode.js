export function createVNode(type, props, ...children) {
  let normalizedProps = {}
  for (let i in props) {
    if (i !== 'key' && i !== 'ref') normalizedProps[i] = props[i]
  }
  
  if (children.length === 0) {
    children = null
  } else if (children.length === 1) {
    children = children[0]
  }
  if (children != null) {
    normalizedProps.children = children
  }

  if (typeof type === 'function' && type.defaultProps != null) {
    for (let i in type.defaultProps) {
      if (normalizedProps[i] === undefined) {
        normalizedProps[i] = type.defaultProps[i]
      }
    }
  }

  return {
    type,
    props: normalizedProps,
    key: props?.key ?? null,
    ref: props?.ref ?? null,
    component: null,
    dom: null,
    parent: null,
    children: null,
  };
}

export function createTextVNode(value) {
  return {
    type: 'TEXT',
    props: value,
    dom: null,
    parent: null,
  };
}
