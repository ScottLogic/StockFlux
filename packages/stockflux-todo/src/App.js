import React, { useState } from 'react';
import Components from 'stockflux-components';
import { StockFluxHooks } from 'stockflux-core';
import useInputField from './utilities/editableInput';
import TodoItem from './components/todo';
import { FaPlus } from 'react-icons/fa';
import './App.css';

function App() {
  const todo = useInputField('');
  const [filterStatus, setFilterStatus] = useState();
  const [todoList, setTodoList] = StockFluxHooks.useLocalStorage(
    'todoList',
    []
  );

  const addTodo = () => {
    setTodoList([
      ...todoList,
      {
        text: todo.value,
        completed: false,
        created: new Date()
      }
    ]);
    todo.setValue('');
  };

  const removeTodo = ({ entry }) => {
    setTodoList(todoList.filter(e => e !== entry));
  };

  const changeStatus = ({ entry, newStatus }) => {
    setTodoList(
      todoList.map(todo =>
        todo === entry ? { ...todo, completed: newStatus } : todo
      )
    );
  };

  const filterTodo = entry => {
    if (filterStatus === undefined) {
      return true;
    }
    if (filterStatus === true && entry.completed) {
      return true;
    }
    if (filterStatus === false && !entry.completed) {
      return true;
    }
    return false;
  };

  return (
    <div className="stockflux-todo">
      <Components.Titlebar />
      <div className="header">ToDos</div>

      <div className="todo-input-container">
        <input type="text" value={todo.value} onChange={todo.onChange}></input>
        <Components.Buttons.Round
          onClick={addTodo}
          disabled={todo.value === ''}
        >
          <FaPlus></FaPlus>
        </Components.Buttons.Round>
      </div>
      <div className="todo-filter-container">
        <label>
          <input
            type="radio"
            name="todo-filter"
            checked={filterStatus === undefined}
            onChange={() => setFilterStatus()}
          />
          All
        </label>
        <label>
          <input
            type="radio"
            name="todo-filter"
            checked={filterStatus === true}
            onChange={() => setFilterStatus(true)}
          />
          Completed
        </label>
        <label>
          <input
            type="radio"
            name="todo-filter"
            checked={filterStatus === false}
            onChange={() => setFilterStatus(false)}
          />
          Uncompleted
        </label>
      </div>
      <div className="container">
        <Components.ScrollWrapperY>
          <div>
            {todoList
              .filter(entry => filterTodo(entry))
              .map((entry, index) => {
                return (
                  <TodoItem
                    key={index}
                    entry={entry}
                    index={index}
                    changeStatus={changeStatus}
                    remove={removeTodo}
                  ></TodoItem>
                );
              })}
          </div>
        </Components.ScrollWrapperY>
      </div>
    </div>
  );
}

export default App;
