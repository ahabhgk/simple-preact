import { diff } from './diff'

export function render(vnode, parentDom) {
  diff(parentDom, vnode, {})
}
