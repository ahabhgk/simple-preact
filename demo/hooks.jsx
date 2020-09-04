import React from '../src';

const {
  useState, useEffect, useCallback, render,
} = React;

function Displayer({ num }) {
  return (
    <div className="displayer">{num}</div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  const inc = useCallback(() => setCount(count + 1), [count]);
  const dec = useCallback(() => setCount(count - 1), [count]);

  useEffect(() => {
    console.log('Counter: fake mount effect');
  }, []);

  useEffect(() => {
    console.log(`Counter: ${count} change effect`);
    return () => {
      console.log(`Counter: ${count} cleanup effect`);
    };
  }, [count]);

  return (
    <div>
      <Displayer num={count} />
      <button onClick={inc}> + </button>
      <button onClick={dec}> - </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Simple Preact: Hooks</h1>
      <Counter />
    </div>
  );
}

render(<App />, document.querySelector('#root'));
