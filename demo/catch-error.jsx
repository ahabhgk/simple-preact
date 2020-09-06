import React from '../src/index';
import { useEffect } from '../src/hooks';

const { render, Component, useState } = React;

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
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

function Counter() {
  const [count, setCount] = useState(0)
  const inc = () => setCount(count + 1)
  useEffect(() => {
    if (count > 2) {
      debugger
      throw new Error('wahaha')
    }
  }, [count])
  return (
    <div>
      <div>{count}</div>
      <button type="button" onClick={inc}> + </button>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Counter />
    </ErrorBoundary>
  )
}

render(<App />, document.querySelector('#root'))
