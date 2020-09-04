import { render } from './render';
import { Component, Fragment } from './component';
import { createVNode } from './vnode';
import {
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from './hooks';

const React = {
  render,
  Component,
  Fragment,
  createElement: createVNode,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
};

export default React;
