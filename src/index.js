import { render } from './diff';
import {
  Component,
  Fragment,
  memo,
  lazy,
  PureComponent,
  Portal,
  forwardRef
} from './component';
import { Suspense } from './suspense'
import { createVNode, createContext, createRef } from './vnode';
import {
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
  useErrorBoundary,
  useImperativeHandle,
} from './hooks';

const React = {
  render,
  Component,
  Fragment,
  memo,
  PureComponent,
  lazy,
  Suspense,
  Portal,
  createElement: createVNode,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
  createRef,
  useContext,
  createContext,
  useErrorBoundary,
  forwardRef,
  useImperativeHandle,
};

export default React;
