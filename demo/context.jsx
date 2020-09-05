import React from '../src';

const {
  useState, useContext, createContext, render,
} = React;

const Count = createContext(0)

function Displayer() {
  const count = useContext(Count)
  return <div>{count}</div>
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <Count.Provider value={count}>
      <h1>Simple Preact: Context</h1>
      <Displayer />
      <button type="button" onClick={() => setCount(count + 1)}> + </button>
      <button type="button" onClick={() => setCount(count - 1)}> - </button>
    </Count.Provider>
  );
}

render(<App />, document.querySelector('#root'));
