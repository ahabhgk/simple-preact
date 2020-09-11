import React from '../src/index';

const { render, Component, createElement: h } = React;

class ClassDisplayer extends Component {
  shouldComponentUpdate(newProps, newState) {
    return Math.random() > 0.5 ? true : false
  }

  render() {
    return (
      <div className="displayer">
        {this.props.children}
      </div>
    );
  }
}

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    this.inc = this.inc.bind(this);
    this.dec = this.dec.bind(this);
  }

  inc() {
    this.setState({ count: this.state.count + 1 });
  }

  dec() {
    this.setState({ count: this.state.count - 1 });
  }

  render() {
    return (
      <div>
        <ClassDisplayer>{this.state.count}</ClassDisplayer>
        <button type="button" onClick={this.inc}> + </button>
        <button type="button" onClick={this.dec}> - </button>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <h1>Simple Preact: Should Update</h1>
        <Counter />
      </div>
    );
  }
}

render(<App />, document.querySelector('#root'));
