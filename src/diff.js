import { options } from './options';
import { Component, Fragment } from './component';
import { createVNode } from './vnode';

export function diff(parentDom, newVNode, oldVNode) {
  const { type } = newVNode;
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
      component.renderCallbacks = [];
    }

    const oldState = component.state;
    const oldProps = component.props;
    const newState = component.newState === null ? oldState : component.newState;

    if (isNew) {
      if (component.componentWillMount != null) {
        component.componentWillMount();
      }
    } else {
      // shouldComponentUpdate
      if (component.componentWillUpdate != null) {
        component.componentWillUpdate(newProps, newState);
      }
    }

    newVNode.parentDom = parentDom;
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
    );
  }

  if (options.diffed) options.diffed(newVNode);
}

function diffChildren(parentDom, newChildren, newVNode, oldVNode) {
  newVNode.children = [];
  const oldChildren = oldVNode.children ?? [];
  let i;
  for (i = 0; i < newChildren.length; i++) {
    let newChild = newChildren[i];
    const oldChild = oldChildren[i] ?? {};

    newChild = Array.isArray(newChild)
      ? createVNode(Fragment, null, newChild)
      : newChild;

    newVNode.children[i] = newChild;

    if (newChild == null) {
      unmount(oldChild, false);
    } else {
      diff(parentDom, newChild, oldChild);
    }

    if (newChild && newChild.dom !== oldChild.dom && newChild.dom != null) {
      parentDom.appendChild(newChild.dom);
    }
  }

  for (i; i < oldChildren.length; i++) {
    unmount(oldChildren[i], false);
  }
}

function diffElementNodes(parentDom, newVNode, oldVNode) {
  const oldProps = oldVNode.props ?? {};
  const newProps = newVNode.props ?? {};
  let { dom } = oldVNode;

  if (dom == null && newVNode.type) {
    if (newVNode.type == 'TEXT') {
      dom = document.createTextNode('');
    } else {
      dom = document.createElement(newVNode.type);
    }
  }

  const newChildren = Array.isArray(newProps.children) ? newProps.children : [newProps.children];
  diffDOMProps(dom, newProps, oldProps);
  diffChildren(dom, newChildren, newVNode, oldVNode);
  newVNode.dom = dom;
}

function diffDOMProps(dom, newProps, oldProps) {
  // remove old props
  Object.keys(oldProps).forEach((propName) => {
    if (propName !== 'children' && propName !== 'key' && !(propName in newProps)) {
      setProperty(dom, propName, null, oldProps[propName]);
    }
  });
  // update old props
  Object.keys(newProps).forEach((propName) => {
    if (propName !== 'children' && propName !== 'key' && oldProps[propName] !== newProps[propName]) {
      setProperty(dom, propName, newProps[propName], oldProps[propName]);
    }
  });
}

function setProperty(dom, propName, newValue, oldValue) {
  if (propName[0] === 'o' && propName[1] === 'n') {
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
    dom[propName] = newValue === null ? '' : newValue;
  }
}

function eventProxy(dom, e) {
  dom.listeners[e.type](options.event ? options.event(e) : e);
}

function unmount(vnode, skip) {
  if (options.unmount) options.unmount(vnode);

  const { component } = vnode;
  if (component != null) {
    if (component.componentWillUnmount) {
      component.componentWillUnmount();
    }
  }

  let dom;
  if (!skip && typeof vnode.type !== 'function') {
    skip = (dom = vnode.dom) != null;
  }

  for (let i = 0; i < vnode.children.length; i++) {
    if (vnode.children[i] != null) unmount(vnode.children[i], skip);
  }

  vnode.dom = null;
  vnode.parentDom = null;
  if (dom != null) dom.parentNode.removeChild(dom);
}
