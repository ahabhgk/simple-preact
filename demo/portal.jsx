import React from '../src';

const { render, createElement: h, Component, Portal } = React;

// 在 DOM 中有两个容器是兄弟级 （siblings）
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Parent extends Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 当子元素里的按钮被点击时，
    // 这个将会被触发更新父元素的 state，
    // 即使这个按钮在 DOM 中不是直接关联的后代
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Portal to="#modal-root">
          {this.state.clicks % 2 ? <Child onClick={(e) => console.log(e)} /> : null}
        </Portal>
      </div>
    );
  }
}

function Child({ onClick }) {
  return (
    <div className="modal" onClick={onClick}>
      Click
    </div>
  );
}

render(<Parent />, document.querySelector('#root'))
