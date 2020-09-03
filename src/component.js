import { diff } from './diff'

export class Component {
  constructor(props) {
    this.props = props
    this.state = {}
    this.newState = null
    this.vnode = null
    this.hooks = null
  }

  setState(updater, cb) {
    // debugger
    if (this.newState === null || this.newState === this.state) {
      this.newState = Object.assign({}, this.state)
    }
    if (typeof updater === 'function') {
      updater = updater({ ...this.newState }, this.props)
    }
    if (updater) {
      this.newState = Object.assign(this.newState, updater)
    }
    if (this.vnode) {
      this.renderCallbacks.push(cb)
      enqueueRender(this)
    }
  }
}

function renderComponent(component) {
  let vnode = component.vnode
  let parentDom = vnode.parentDom
  diff(parentDom, vnode, { ...vnode })
}

const rerenderQueue = []
function process() {
  rerenderQueue.forEach(renderComponent)
  rerenderQueue.length = 0
}

function enqueueRender(component) {
  rerenderQueue.push(component)
  Promise.resolve().then(process)
}
