import { render } from './render';
import { Component, Fragment, memo, lazy, PureComponent, Portal } from './component';
import { Suspense } from './suspense'
import { createVNode } from './vnode';
import { createContext } from './create-context'
import {
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
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
  useMemo,
  useCallback,
  useRef,
  useContext,
  createContext,
};

export default React;
