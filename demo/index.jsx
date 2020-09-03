import React from '../src/index.js'

const { render, Component } = React

class Displayer extends Component {
  componentWillMount() {
    console.log('Displayer: will mount')
  }

  componentDidMount() {
    console.log('Displayer: did mount')
  }

  componentWillUpdate() {
    console.log('Displayer: will update')
  }

  componentDidUpdate() {
    console.log('Displayer: did update')
  }

  componentWillUmount() {
    console.log('Displayer: will umount')
  }

  render() {
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

  componentWillMount() {
    console.log('Counter: will mount')
  }

  componentDidMount() {
    console.log('Counter: did mount')
  }

  componentWillUpdate() {
    console.log('Counter: will update')
  }

  componentDidUpdate() {
    console.log('Counter: did update')
  }

  componentWillUmount() {
    console.log('Counter: will umount')
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
  componentWillMount() {
    console.log('App: will mount')
  }

  componentDidMount() {
    console.log('App: did mount')
  }

  componentWillUpdate() {
    console.log('App: will update')
  }

  componentDidUpdate() {
    console.log('App: did update')
  }

  componentWillUmount() {
    console.log('App: will umount')
  }
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
