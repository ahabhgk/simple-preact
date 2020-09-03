import { diff } from './diff.js'

export function render(vnode, parentDom) {
  diff(parentDom, vnode, {})
}
