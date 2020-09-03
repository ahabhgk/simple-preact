import { commitQueue } from './commit.js'
import { options } from './options.js'

export function diff(parentDom, newVNode, oldVNode) {
  const { type } = newVNode
  if (typeof type === 'function') {
    let isNew, component, oldProps, oldState, newState
    let newProps = newVNode.props

    if (oldVNode.component) {
      component = newVNode.component = oldVNode.component
    } else {
      if ('prototype' in type && type.prototype.render) {
        component = newVNode.component = new type(newVNode.props)
      } else {
        component = newVNode.component = new Component(newVNode.props)
        newVNode.render = type
      }
      isNew = true
      component.renderCallbacks = []
    }

    oldState = component.state
    oldProps = component.props
    newState = component.newState === null ? oldState : component.newState

    if (isNew) {
      if (component.componentWillMount != null) {
        component.componentWillMount()
      }
      if (component.componentDidMount != null) {
        component.renderCallbacks.push(component.componentDidMount)
      }
    } else {
      // shouldComponentUpdate
      if (component.componentWillUpdate != null) {
        component.componentWillUpdate(newProps, newState)
      }
      if (component.componentDidUpdate != null) {
        component.renderCallbacks.push(() => {
          component.componentDidUpdate(oldProps, oldState)
        })
      }
    }

    newVNode.parentDom = parentDom
    component.vnode = newVNode

    if (options.render) options.render(newVNode)

    component.state = newState
    component.props = newProps
    const renderResult = component.render(newProps)
    const newChildren = Array.isArray(renderResult) ? renderResult : [renderResult]

    diffChildren(
      parentDom,
      newChildren,
      newVNode || {},
      oldVNode || {},
    )

    if (component.renderCallbacks.length) {
      commitQueue.push(component)
    }
  } else {
    diffElementNodes(
      parentDom,
      newVNode || {},
      oldVNode || {},
    )
  }
}

function diffChildren(parentDom, newChildren, newVNode, oldVNode) {
  let oldChildren = oldVNode.props?.children ?? {}
  let i
  for (i = 0; i < newChildren.length; i++) {
    let newChild = newChildren[i]
    let oldChild = oldChildren[i]
    newVNode.props.children[i] = newChild
    diff(parentDom, newChild, oldChild || {})
    newVNode.dom = oldVNode.dom
  }
  for (; i < oldChildren.length; i++) {
    umount(oldChildren[i])
  }
}

function diffElementNodes(parentDom, newVNode, oldVNode) {
  let oldProps = oldVNode.props || {}
  let newProps = newVNode.props
  let dom = oldVNode.dom

  if (dom == null) {
    if (newVNode.type == 'TEXT') {
      dom = document.createTextNode('')
    } else {
      dom = document.createElement(newVNode.type)
    }
  }

  diffDOMProps(dom, newProps, oldProps)
  diffChildren(dom, newVNode.props.children, newVNode, oldVNode)
  newVNode.dom = dom

  if (oldVNode.dom == null) {
    parentDom.appendChild(dom)
  }
}

function diffDOMProps(dom, newProps, oldProps) {
  // remove old props
  for (let propName in oldProps) {
    if (propName !== 'children' && propName !== 'key' && !(propName in newProps)) {
			setProperty(dom, propName, null, oldProps[propName])
		}
  }
  // update old props
  for (let propName in newProps) {
    if (propName !== 'children' && propName !== 'key' && oldProps[propName] !== newProps[propName]) {
      setProperty(dom, propName, newProps[propName], oldProps[propName])
    }
  }
}

function setProperty(dom, propName, newValue, oldValue) {
  // if (propName === 'className') propName = 'class'
  if (propName[0] === 'o' && propName[1] === 'n') {
    const eventType = propName.toLowerCase().slice(2)

    if (!dom.listeners) dom.listeners = {}
    dom.listeners[eventType] = newValue

    if (newValue) {
			if (!oldValue) {
        dom.addEventListener(eventType, (e) => eventProxy(dom, e))
      }
		} else {
			dom.removeEventListener(eventType, eventProxy)
		}
  } else {
    dom[propName] = newValue === null ? '' : newValue
  }
}

function eventProxy(dom, e) {
	dom.listeners[e.type](options.event ? options.event(e) : e)
}

function umount(parentDom, vnode) {
  let component = vnode.component
  if (component != null) {
    if (component.componentWillUmmount) {
      component.componentWillUmmount()
    }
  }
  for (let i = 0; i < vnode.props.children.length; i++) {
    if (vnode.dom != null) umount(vnode.dom, vnode.props.children[i])
  }
  vnode.parentDom = null
  if (vnode.dom != null) parentDom.removeChild(vnode.dom)
}
