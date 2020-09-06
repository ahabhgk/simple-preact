import { diff } from './diff';
import { shallowCompare } from './helpers';
import { createVNode } from './vnode';

export class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.newState = null;
    this.vnode = null;
    this.hooks = null;
    // this.context = {};
  }

  setState(updater) {
    // debugger
    if (this.newState === null || this.newState === this.state) {
      this.newState = { ...this.state };
    }
    if (typeof updater === 'function') {
      updater = updater({ ...this.newState }, this.props);
    }
    if (updater) {
      this.newState = Object.assign(this.newState, updater);
    }
    if (this.vnode) {
      enqueueRender(this);
    }
  }
}

function renderComponent(component) {
  const { vnode } = component;
  const { parentDom } = vnode;
  console.log(vnode)
  diff(parentDom, vnode, { ...vnode });
}

let rerenderQueue = [];
function process() {
  rerenderQueue = [...new Set(rerenderQueue)]
  rerenderQueue.forEach(renderComponent);
  rerenderQueue.length = 0;
}

export function enqueueRender(component) {
  rerenderQueue.push(component);
  Promise.resolve().then(process);
}

export function Fragment(props) {
  return props.children;
}

export function memo(fc, comparer) {
  if (!comparer) comparer = shallowCompare
  function Memoed(props) {
    this.shouldComponentUpdate = function shouldUpdate(nextProps) {
      // console.log(props, nextProps)
      return comparer(props, nextProps)
    }
    return createVNode(fc, props, props.children)
  }
  return Memoed
}
