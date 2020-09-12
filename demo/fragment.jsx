import React from '../src';

const { render, createElement: h, useState } = React;

const list = [
  { name: 'bkk', age: 20 },
  { name: 'ljj', age: 18 },
  { name: 'ahab', age: 19 },
];

function Person({ name, age }) {
  return (
    <li>
      <strong>
        name: {name},
      </strong>
      <span>
        age: {age}
      </span>
    </li>
  );
}

function PersonList({ children }) {
  const [show, setShow] = useState(true);
  return (
    <>
      <h3>Person infos: </h3>
      <button type="button" onClick={() => setShow(!show)}>Show?</button>
      {show ? <ul>{children}</ul> : null}
    </>
  );
}

function App() {
  return (
    <>
      <h1>Simple Preact: Fragment</h1>
      <PersonList>
        {list.map((p) => <Person name={p.name} age={p.age} />)}
      </PersonList>
    </>
  );
}

render(<App />, document.querySelector('#root'));
