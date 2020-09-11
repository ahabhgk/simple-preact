import React from '../src';

const { Component, render, createElement: h, Suspense, lazy, useState } = React;

const Reorder = lazy(() => import('./lazy-sfc.jsx'));

function App() {
  return (
    <div>
      <h1>Simple Preact: Lazy Load</h1>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Reorder />
      </Suspense>
    </div>
  )
}

render(<App />, document.querySelector('#root'))
