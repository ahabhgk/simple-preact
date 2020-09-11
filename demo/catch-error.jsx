import React from '../src/index';

const { render, Component, useState, useEffect, createElement: h } = React;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log("getDerivedStateFromError", error)
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error) {
    // 你同样可以将错误日志上报给服务器
    console.log("componentDidCatch: ", error);
  }

  render() {
    if (this.state.hasError) {
      console.log(this)
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

// function Counter() {
//   const [count, setCount] = useState(0)
//   const inc = () => setCount(count + 1)
//   useEffect(() => {
//     if (count > 2) {
//       debugger
//       throw new Error('wahaha')
//     }
//   }, [count])
//   return (
//     <div>
//       <div>{count}</div>
//       <button type="button" onClick={inc}> + </button>
//     </div>
//   )
// }

class Counter extends Component {
  componentWillUnmount() {
    throw new Error('wahaha')
  }
  render() {
    return (
      <div>Counter</div>
    )
  }
}

function App() {
  const [show, setShow] = useState(true)
  return (
    <ErrorBoundary>
      <button onClick={() => setShow(!show)}>Show?</button>
      {show ? <Counter /> : null}
    </ErrorBoundary>
  )
}

render(<App />, document.querySelector('#root'))
