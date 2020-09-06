import { enqueueRender } from './component'

// 副作用的处理都放在了生命周期和 useEffect 中，所以在所有生命周期和 effect 触发的地方加上 try/catch 即可
export function catchError(error, vnode) {
  let hasCaught = false
  while (vnode.parent) {
    const { parent } = vnode
    const { component } = parent
    if (component) {
      try {
        if (component.constructor && component.constructor.getDerivedStateFromError != null) {
          hasCaught = true
					component.setState(component.constructor.getDerivedStateFromError(error));
        }

        if (component.componentDidCatch != null) {
          hasCaught = true
          component.componentDidCatch(error)
        }

        if (hasCaught) return enqueueRender(component)
      } catch (e) {
        error = e
      }
    }
  }

  throw error
}
