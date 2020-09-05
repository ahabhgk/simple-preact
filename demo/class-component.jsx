import React from '../src/index';

const { render, Component } = React;

class Displayer extends Component {
  componentWillMount() {
    console.log('Displayer: will mount');
  }

  componentDidMount() {
    console.log('Displayer: did mount');
  }

  componentWillUpdate() {
    console.log('Displayer: will update');
  }

  componentDidUpdate() {
    console.log('Displayer: did update');
  }

  componentWillUnmount() {
    console.log('Displayer: will unmount');
  }

  render() {
    console.log(this);
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

  componentWillMount() {
    console.log('Counter: will mount');
  }

  componentDidMount() {
    console.log('Counter: did mount');
  }

  componentWillUpdate() {
    console.log('Counter: will update');
  }

  componentDidUpdate() {
    console.log('Counter: did update');
  }

  componentWillUnmount() {
    console.log('Counter: will unmount');
  }

  inc() {
    this.setState({ count: this.state.count + 1 });
  }

  dec() {
    this.setState({ count: this.state.count - 1 });
  }

  render() {
    return (
      <>
        <Displayer>{this.state.count}</Displayer>
        <button type="button" onClick={this.inc}> + </button>
        <button type="button" onClick={this.dec}> - </button>
      </>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
    this.handleShowCounter = this.handleShowCounter.bind(this);
  }

  componentWillMount() {
    console.log('App: will mount');
  }

  componentDidMount() {
    console.log('App: did mount');
  }

  componentWillUpdate() {
    console.log('App: will update');
  }

  componentDidUpdate() {
    console.log('App: did update');
  }

  componentWillUnmount() {
    console.log('App: will unmount');
  }

  handleShowCounter() {
    this.setState({ show: !this.state.show });
  }

  render() {
    console.log(this);
    return (
      <div>
        <h1>Simple Preact: Class Component</h1>
        <button type="button" onClick={this.handleShowCounter}>Show?</button>
        {this.state.show ? <Counter /> : null}
      </div>
    );
  }
}

render(<App />, document.querySelector('#root'));
