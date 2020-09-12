import { options } from './options';
import { Component, Fragment } from './component';
import { createVNode, createTextVNode } from './vnode';
import { Suspense } from './suspense';

export function diff(parentDom, newVNode, oldVNode, isSVG = false) {
  const { type } = newVNode;

  // 为了 mount 和 update 的生命周期
  try {
    if (typeof type === 'function') {
      let isNew;
      let component;
      const newProps = newVNode.props;

      if (oldVNode.component) {
        component = newVNode.component = oldVNode.component;
      } else {
        if ('prototype' in type && type.prototype.render) {
          component = newVNode.component = new type(newVNode.props);
        } else {
          component = newVNode.component = new Component(newVNode.props);
          component.render = type;
        }
        isNew = true;
      }

      const oldState = component.state;
      const oldProps = component.props;
      const newState = component.newState === null ? oldState : component.newState;

      if (isNew) {
        if (component.componentWillMount != null) {
          component.componentWillMount();
        }
      } else {
        if (
          component.shouldComponentUpdate != null &&
          component.shouldComponentUpdate(newProps, newState) === false
        ) {
          component.state = newState;
          component.props = newProps;
          component.vnode = newVNode;
          newVNode.children = oldVNode.children;
          newVNode.dom = oldVNode.dom;
          return;
        }
        if (component.componentWillUpdate != null) {
          component.componentWillUpdate(newProps, newState);
        }
      }

      component.parentDom = parentDom; // parent.dom 的话 parent 可能是组件，没有 dom
      component.vnode = newVNode;

      if (options.render) options.render(newVNode);

      component.state = newState;
      component.props = newProps;
      const renderResult = component.render(newProps);
      const newChildren = Array.isArray(renderResult) ? renderResult : [renderResult];

      diffChildren(
        parentDom,
        newChildren,
        newVNode ?? {},
        oldVNode ?? {},
        isSVG
      );

      if (isNew) {
        if (component.componentDidMount != null) {
          component.componentDidMount();
        }
      } else if (component.componentDidUpdate != null) {
        component.componentDidUpdate(oldProps, oldState);
      }
    } else {
      diffElementNodes(
        parentDom,
        newVNode ?? {},
        oldVNode ?? {},
        isSVG,
      );
    }

    if (options.diffed) options.diffed(newVNode);
  } catch (e) {
    // catchError 和 catchPromise，Suspense 异步请求在 render 时 throw promise
    // 所以只需要在这里包裹 render 调用即可
    options.catchError(e, newVNode, oldVNode);
  }
}

export function diffChildren(parentDom, newChildren, newVNode, oldVNode, isSVG = false) {
  newVNode.children = [];
  const oldChildren = oldVNode.children ?? [];

  let lastIndex = 0
  for (let i = 0; i < newChildren.length; i++) {
    let newChild = newChildren[i];
    if (newChild == null) continue
    newChild = Array.isArray(newChild)
      ? createVNode(Fragment, null, newChild)
      : typeof newChild === 'string' || typeof newChild === 'number'
        ? createTextVNode(newChild)
        : newChild
    newVNode.children[i] = newChild;
    newChild.parent = newVNode;

    let oldChild = null;
    let find = false
    for (let j = 0; j < oldChildren.length; j++) {
      if (
        oldChildren[j] &&
        oldChildren[j].key === newChild.key &&
        oldChildren[j].type === newChild.type
      ) {
        find = true
        oldChild = oldChildren[j]
        oldChildren[j] = null

        diff(parentDom, newChild, oldChild, isSVG);

        if (j < lastIndex) { // 移动
          const refNode = newChildren[i - 1].dom.nextSibling
          parentDom.insertBefore(oldChild.dom, refNode)
        } else {
          lastIndex = j
        }
        break
      }
    }

    if (!find) {
      diff(parentDom, newChild, {}, isSVG) // mount
      if (oldChildren.langth) {
        const refNode = i - 1 < 0
          ? oldChildren[0].dom
          : newChildren[i - 1].dom.nextSibling
        newChild.dom && parentDom.insertBefore(newChild.dom, refNode)
      } else {
        newChild.dom && parentDom.appendChild(newChild.dom)
      }
    }
  }

  for (let i = 0; i < oldChildren.length; i++) {
    if (oldChildren[i] != null) unmount(oldChildren[i], false);
  }
}

function diffElementNodes(parentDom, newVNode, oldVNode, isSVG) {
  isSVG = newVNode.type === 'svg' || isSVG
  const oldProps = oldVNode.props ?? {};
  const newProps = newVNode.props ?? {};
  let { dom } = oldVNode;

  if (dom == null && newVNode.type) { // mount
    if (newVNode.type === 'TEXT') {
      dom = document.createTextNode(newProps)
    } else {
      dom = isSVG
        ? document.createElementNS('http://www.w3.org/2000/svg', newVNode.type)
        : document.createElement(newVNode.type)
    }
  }

  // update
  if (newVNode.type === 'TEXT') {
    if (oldProps !== newProps && dom.data != newProps) {
			dom.data = newProps;
		}
  } else {
    const newChildren = Array.isArray(newProps.children) ? newProps.children : [newProps.children];
    diffDOMProps(dom, newProps, oldProps, isSVG);
    diffChildren(dom, newChildren, newVNode, oldVNode, isSVG);
  }
  newVNode.dom = dom;
}

function diffDOMProps(dom, newProps, oldProps, isSVG = false) {
  // remove old props
  Object.keys(oldProps).forEach((propName) => {
    if (propName !== 'children' && propName !== 'key' && !(propName in newProps)) {
      setProperty(dom, propName, null, oldProps[propName], isSVG);
    }
  });
  // update old props
  Object.keys(newProps).forEach((propName) => {
    if (propName !== 'children' && propName !== 'key' && oldProps[propName] !== newProps[propName]) {
      setProperty(dom, propName, newProps[propName], oldProps[propName], isSVG);
    }
  });
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/

function setProperty(dom, propName, newValue, oldValue, isSVG = false) {
  if (propName === 'className') {
    dom.className = newValue
  } else if (propName[0] === 'o' && propName[1] === 'n') {
    const eventType = propName.toLowerCase().slice(2);

    if (!dom.listeners) dom.listeners = {};
    dom.listeners[eventType] = newValue;

    if (newValue) {
      if (!oldValue) {
        dom.addEventListener(eventType, (e) => eventProxy(dom, e));
      }
    } else {
      dom.removeEventListener(eventType, eventProxy);
    }
  } else {
    if (isSVG && propName.startsWith('xlink:')) {
      if (newValue == null) {
        dom.removeAttributeNS('http://www.w3.org/1999/xlink', propName.slice(6))
      } else {
        dom.setAttributeNS('http://www.w3.org/1999/xlink', propName.slice(6))
      }
    } else if (domPropsRE.test(propName)) {
      dom[propName] = newValue
    } else {
      dom.setAttribute(propName, newValue)
    }
  }
}

function eventProxy(dom, e) {
  dom.listeners[e.type](options.event ? options.event(e) : e);
}

export function unmount(vnode, skip) {
  if (options.unmount) options.unmount(vnode);

  const { component } = vnode;
  if (component != null) {
    if (component.componentWillUnmount) {
      try {  
        component.componentWillUnmount();
      } catch (e) {
        options.catchError(e, vnode)
      }
    }
    component.parentDom = null
  }

  let dom;
  if (!skip && typeof vnode.type !== 'function') {
    skip = (dom = vnode.dom) != null;
  }

  if (vnode.children) {
    for (let i = 0; i < vnode.children.length; i++) {
      if (vnode.children[i] != null) unmount(vnode.children[i], skip);
    }
  }

  vnode.dom = null;
  if (dom != null) dom.parentNode.removeChild(dom);
}
