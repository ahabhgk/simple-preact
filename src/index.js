import { render } from './render.js'
import { Component } from './component.js'
import { createVNode } from './vnode.js'

const React = {
  render,
  Component,
  createElement: createVNode,
}

export default React
