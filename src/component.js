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
    this.parentDom = null
    // this.renderCallbacks = [];
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
  const { vnode, parentDom } = component;
  diff(parentDom, vnode, { ...vnode });
}

let rerenderQueue = [];
function process() {
  const queue = [...new Set(rerenderQueue)] // perf: 去重，防止多次无用的更新
  rerenderQueue.length = 0; // 先清空在更新，防止更新中加入新的更新之后在清空，导致之后的更新无效
  queue.forEach(renderComponent);
}

const defer = Promise.prototype.then.bind(Promise.resolve())
export function enqueueRender(component) {
  rerenderQueue.push(component);
  defer(process);
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
