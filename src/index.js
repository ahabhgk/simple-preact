import { render } from './render'
import { Component } from './component'
import { createVNode } from './vnode'
import {
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from './hooks'

const React = {
  render,
  Component,
  createElement: createVNode,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
}

export default React
