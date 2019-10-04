import React from 'react';
import Components from 'stockflux-components';
import { FaCheck, FaUndo, FaTrash } from 'react-icons/fa';
import './Todo.css';

const TodoItem = ({ entry, remove, index, changeStatus }) => {
  const formatDate = unformattedDate => {
    const dateObject = new Date(unformattedDate);
    return dateObject.toLocaleString();
  };
  return (
    <div className="todo-item">
      <Components.Buttons.Round
        onClick={() => changeStatus({ entry, newStatus: !entry.completed })}
      >
        {entry.completed ? <FaUndo></FaUndo> : <FaCheck></FaCheck>}
      </Components.Buttons.Round>
      <div className={'todo-item-details ' + (entry.completed ? 'todo-completed' : 'todo-outstanding')}>
        <p>{entry.text}</p>
        <span className="todo-created">{formatDate(entry.created)}</span>
      </div>
      <Components.Buttons.Round
        className="todo-delete"
        onClick={() => remove({ entry, index })}
      >
        <FaTrash></FaTrash>
      </Components.Buttons.Round>
    </div>
  );
};

export default TodoItem;
