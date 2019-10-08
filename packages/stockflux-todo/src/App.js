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
  const [dragIndex, setdragIndex] = useState();
  const [dragOverIndex, setDragOverIndex] = useState();

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

  const filterTodo = entry => {
    return filterStatus === undefined || entry.completed === filterStatus;
  };

  const clearCompletedTasks = () => {
    setTodoList(todoList.filter(todo => !todo.completed));
  };

  const getIndexFromTransfer = types => {
    for (let i = 0; i < types.length; i += 1) {
      const dataTransferObj = JSON.parse(types[i]);
      if (Object.keys(dataTransferObj)[0] === 'index') {
        return dataTransferObj.index;
      }
    }
    return undefined;
  };

  // let cardHeight;
  // let dragStartClientY;
  const [cardHeight, setCardHeight] = useState();
  const [dragStartClientY, setDragStartClientY] = useState();

  const onDragStart = e => {
    //console.log(getIndexFromTransfer(e.dataTransfer.types));
    setdragIndex(getIndexFromTransfer(e.dataTransfer.types));
    console.log(e.target.getBoundingClientRect().height);
    console.log(e.nativeEvent.clientY);
    setCardHeight(e.target.getBoundingClientRect().height);
    setDragStartClientY(e.nativeEvent.clientY);
  };

  const onDragEnd = () => {
    setdragIndex();
  };

  const onDrop = () => {
    console.log('dropped');
    console.log('Move X to Y', dragIndex, dragOverIndex);
    setDragOverIndex();
    setdragIndex();
  };

  const onDragOver = event => {
    const dragOverIndexOffset = Math.ceil(
      ((event.nativeEvent.clientY - dragStartClientY) / (cardHeight / 2) + 1) /
        2
    );
    let nextDragOverIndex = dragIndex + dragOverIndexOffset;

    if (nextDragOverIndex <= dragIndex) {
      nextDragOverIndex -= 1;
    }

    if (todoList[nextDragOverIndex] && nextDragOverIndex !== dragOverIndex) {
      setDragOverIndex(nextDragOverIndex);
    } else if (nextDragOverIndex >= todoList.length) {
      setDragOverIndex(todoList.length);
    }
    event.preventDefault();
  };

  return (
    <div
      className="stockflux-todo"
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
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
          {todoList
            .filter(entry => filterTodo(entry))
            .map((entry, index) => {
              return (
                <TodoItem
                  // onDragStart={onDragStart}
                  // onDragOver={onDragOver}
                  // onDragEnd={onDragEnd}
                  key={index}
                  entry={entry}
                  index={index}
                  changeStatus={changeStatus}
                  remove={removeTodo}
                  dragOver={dragOverIndex === index}
                  dragging={dragOverIndex}
                ></TodoItem>
              );
            })}
        </Components.ScrollWrapperY>
      </div>
    </div>
  );
}

export default App;
