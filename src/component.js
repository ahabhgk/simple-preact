import { diff, unmount, commitQueue, commit } from './diff';
import { shallowCompare } from './helpers';
import { createVNode } from './vnode';
import { render } from './diff';
import { options } from './options';

export class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this.newState = null;
    this.vnode = null;
    this.hooks = null;
    this.parentDom = null
    this.renderCallbacks = [];
  }

  setState(updater, cb) {
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
      if (cb) this.renderCallbacks.push(cb)
      enqueueRender(this);
    }
  }

  forceUpdate(cb) {
    if (this.vnode) {
      if (cb) this.renderCallbacks.push(cb)
      enqueueRender(this)
    }
  }
}

function renderComponent(component) {
  const { vnode, parentDom } = component;
  diff(parentDom, vnode, { ...vnode });
  commit(commitQueue, vnode)
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

export class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this.props, nextProps) || shallowCompare(this.state, nextState)
  }

  render() {
    return this.props.children
  }
}

export function lazy(loader) {
  let promise
  let component
  let error

  function Lazy(props) {
    if (!promise) {
      promise = loader()
      promise.then(
        exports => {
					component = exports.default || exports
				},
				e => {
					error = e
				}
      )
    }

    if (error) {
      throw error
    }

    if (!component) {
      throw promise
    }

    return createVNode(component, props, props.children)
  }

  return Lazy
}

export function Portal({ children, to }) {
  to = typeof to === 'string' ? document.querySelector(to) : to

  const cleanup = () => {
    this.parentDom.removeChild(this.placeholder)
    unmount(this.children)
    this.hasMounted = false
  }

  this.componentWillUnmount = cleanup

  if (this.target && this.target !== to) {
    cleanup()
  }

  if (children) {
    if (!this.hasMounted) {
      this.placeholder = document.createComment('Portal')
      this.parentDom.appendChild(this.placeholder)
      this.hasMounted = true
      this.target = to
      render(children, to)
    } else {
      diff(
        to,
        children,
        this.children,
      )
    }
    this.children = children
  } else if (this.hasMounted) {
    cleanup()
  }

  return null
}

export function forwardRef(fc) {
  function Forwarded(props) {
    const { vnode } = this
    return fc(props, vnode.ref)
  }
  return Forwarded
}
