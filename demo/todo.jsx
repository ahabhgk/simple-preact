import React from '../src';

const { Component, render, createElement: h } = React;

let counter = 0;

export default class TodoList extends Component {
	state = { todos: [], text: '' };

	setText = e => {
		this.setState({ text: e.target.value });
	};

	addTodo = () => {
		let { todos, text } = this.state;
		todos = todos.concat({ text, id: ++counter });
		this.setState({ todos, text: '' });
	};

	removeTodo = e => {
		let id = e.target.getAttribute('id');
    console.log(id)
		this.setState({ todos: this.state.todos.filter(t => t.id != id) });
	};

	render() {
    const { todos, text } = this.state
		return (
			<form onSubmit={this.addTodo} action="javascript:">
				<input value={text} onInput={this.setText} />
				<button type="submit">Add</button>
				<ul>
					<TodoItems todos={todos} removeTodo={this.removeTodo} />
				</ul>
			</form>
		);
	}
}

function TodoItems({ todos, removeTodo }) {
  return todos.map(todo => (
    <li key={todo.id}>
      <button type="button" onClick={removeTodo} id={todo.id}>
        &times;
      </button>{' '}
      {todo.text}
    </li>
  ));
}

render(<TodoList />, document.querySelector('#root'));
