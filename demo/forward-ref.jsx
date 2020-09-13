import React from '../src';

const { createRef, render, forwardRef, createElement: h, useRef, useImperativeHandle, useEffect } = React

const ChildInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => inputRef.current);
  return <input type="text" name="child input" ref={inputRef} />;
})

function App() {
  const inputRef = useRef(null);

  useEffect(() => {
    console.log(inputRef)
    inputRef.current.focus();
  }, []);

  return (
    <div>
      <ChildInput ref={inputRef} />
    </div>
  );
}

render(<App />, document.querySelector('#root'))
