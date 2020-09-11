import React from '../src';

const {
  useState, useEffect, useCallback, render, memo, createElement: h
} = React;

function Displayer({ num }) {
  return (
    <div className="displayer">{num}</div>
  );
}

const Btn = ({ onClick, children }) => {
  console.log('render Btn')
  return <button type="button" onClick={onClick}>{children}</button>
}

export default function Counter() {
  const [count, setCount] = useState(0);
  const inc = useCallback(() => {
    setCount(count + 1)
    setCount(count + 1)
  }, [count]);
  const dec = useCallback(() => setCount(c => c - 1), []);

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
      <Btn onClick={inc}> + </Btn>
      <Btn onClick={dec}> - </Btn>
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
