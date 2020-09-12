import React from '../src';

const { render, createElement: h } = React;

function App() {
  return (
    <svg viewBox="0 0 360 360">
      <path
        stroke="white"
        fill="black"
        d="M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z"
      />
    </svg>
  )
}

render(<App />, document.querySelector('#root'))
