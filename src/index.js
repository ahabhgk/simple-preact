import { render } from './render';
import { Component, Fragment, memo } from './component';
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
  createElement: createVNode,
  useState,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
  memo,
  createContext,
};

export default React;
