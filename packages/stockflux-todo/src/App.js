import React, { useState } from 'react';
import Components from 'stockflux-components';
import { StockFluxHooks } from 'stockflux-core';
import useInputField from './utilities/editableInput';
import TodoItem from './components/todo';
import { FaPlus, FaTasks, FaTrash } from 'react-icons/fa';
import './App.css';

function App() {
  const todo = useInputField('');
  const [filterStatus, setFilterStatus] = useState();
  const [todoList, setTodoList] = StockFluxHooks.useLocalStorage(
    'todoList',
    []
  );

  const handleFormSubmit = event => {
    event.preventDefault();
    addTodo();
  };

  const addTodo = () => {
    todo.value &&
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

  const filterTodo = entry =>
    filterStatus === undefined || entry.completed === filterStatus;

  const clearCompletedTasks = () => {
    setTodoList(todoList.filter(todo => !todo.completed));
  };

  return (
    <div className="stockflux-todo">
      <Components.Titlebar />
      <div className="header">Checklist</div>
      <div className="container">
        <div className="todo-input-container">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              value={todo.value}
              onChange={todo.onChange}
            ></input>
          </form>
          <Components.Buttons.Round
            onClick={addTodo}
            disabled={todo.value === ''}
          >
            <FaPlus></FaPlus>
          </Components.Buttons.Round>
        </div>
        <div className="todo-filter-container">
          <Components.Buttons.Round
            onClick={() => setFilterStatus()}
            className={filterStatus === undefined ? 'todo-active' : ''}
            title="Show all Tasks"
          >
            <FaTasks></FaTasks>
          </Components.Buttons.Round>
          <Components.Buttons.Round
            onClick={() => setFilterStatus(true)}
            className={filterStatus === true ? 'todo-active' : ''}
            title="Show Completed Tasks"
          >
            C
          </Components.Buttons.Round>
          <Components.Buttons.Round
            onClick={() => setFilterStatus(false)}
            title="Show Unfinished Tasks"
            className={filterStatus === false ? 'todo-active' : ''}
          >
            O
          </Components.Buttons.Round>
          <Components.Buttons.Round
            className="todo-remove-completed"
            onClick={() => clearCompletedTasks()}
          >
            <FaTrash></FaTrash>
          </Components.Buttons.Round>
        </div>

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
