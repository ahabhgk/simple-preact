import { options } from './options'
import { Component, Fragment } from './component'
import { createVNode } from './vnode'

const originalCatchError = options.catchError
options.catchError = function catchPromise(error, newVNode, oldVNode) {
  if (typeof error.then === 'function') {
    let vnode = newVNode
    while (vnode.parent) {
      const { parent } = vnode
      const { component } = parent
      if (component && component.childrenDidSuspend) {
        if (newVNode.dom == null) {
          newVNode.dom = oldVNode.dom
          debugger
          newVNode.children = oldVNode.children
        }
        return component.childrenDidSuspend(error, newVNode.component)
      }

      vnode = parent
    }
  }
  originalCatchError(error, newVNode)
}

export class Suspense extends Component {
  state = { resolved: true }
  suspenders = []
  constructor(props) {
    super(props)
  }

  childrenDidSuspend(promise, child) {
    console.log(promise, child)
    this.setState({ resolved: false })
    // this.suspenders.push(child)

    // const originalChildWillUnmount = child.componentWillUnmount;
    // child.componentWillUnmount = () => {
    //   debugger
    //   this.vnode.component = null
    //   console.log('reset component', this.vnode)
    //   if (originalChildWillUnmount) originalChildWillUnmount()
    // }

    const onResolved = () => {
      if (this.state.resolved) return
      this.setState({ resolved: true })
      // while (this.suspenders.length) {
      //   const child = this.suspenders.pop()
      //   child.setState(child.newState)
      // }
      child.forceUpdate()
    }
    promise.then(onResolved)
  }

  render() {
    // this.vnode.component = null
    return this.state.resolved ? this.props.children : this.props.fallback
  }
}
