import React from '../src'

const { render, useState, useRef, useEffect, createElement: h } = React

function App() {
  const [state, setState] = useState(true);
  const ref = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      setState(false);
      setTimeout(() => {
        console.log("ref ", ref.current);
      }, 1000);
    }, 2000);
  }, []);
  return (
    <div>
      {state ? (
        <div key="a">
          <div
            ref={div => {
              console.log("a ", div);
              ref.current = div;
            }}
          />a
        </div>
      ) : (
        <div key="b">
          <span
            ref={span => {
              console.log("b ", span);
              ref.current = span;
            }}
          />b
        </div>
      )}
    </div>
  )
}

render(<App />, document.querySelector('#root'))
