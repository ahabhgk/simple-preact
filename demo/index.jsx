import React from '../src/index.js'

const { render, Component } = React

class Displayer extends Component {
  render() {
    console.log(this.props)
    return (
      <div className="displayer">
        {this.props.children[0]}
      </div>
    )
  }
}

class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  inc = () => {
    this.setState({ count: this.state.count + 1 })
  }

  dec = () => {
    this.setState({ count: this.state.count - 1 })
  }

  render() {
    return (
      <div>
        <Displayer>{this.state.count}</Displayer>
        <button onClick={this.inc}> + </button>
        <button onClick={this.dec}> - </button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <h1>Simple Preact</h1>
        <Counter />
      </div>
    )
  }
}

render(<App />, document.querySelector('#root'))
