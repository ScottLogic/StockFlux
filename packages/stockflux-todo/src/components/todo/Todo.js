import React from 'react';
import Components from 'stockflux-components';
import classNames from 'classnames';
import { FaCheck, FaUndo, FaTrash } from 'react-icons/fa';
import './Todo.css';

const TodoItem = ({
  entry,
  remove,
  index,
  changeStatus,
  //onDragStart,
  onDrop,
  //onDragOver,
  onDragEnd,
  isDragging,
  dragOver
}) => {
  const formatDate = unformattedDate => {
    const dateObject = new Date(unformattedDate);
    return dateObject.toLocaleString();
  };

  const onDragStart = index => {
    return e => {
      const indexData = { index: index };
      e.dataTransfer.setData(JSON.stringify(indexData), '');
    };
  };

  return (
    <div
      id={`todo_${index}`}
      className={classNames({
        'todo-wrapper': true,
        dragging: isDragging,
        dragOver: dragOver
      })}
      draggable="true"
      onDragStart={onDragStart(index)}
      //onDragOver={onDragOver(index)}
      // onDragOver={e => onDragOver(e, index)}
      // onDragEnd={onDragEnd}
      // onDrop={onDrop}
    >
      <div className="drop-target">
        <div
          className="card darkens default-background todo-item"
          draggable="false"
        >
          {entry && !dragOver && (
            <>
              <Components.Buttons.Round
                onClick={() =>
                  changeStatus({ entry, newStatus: !entry.completed })
                }
              >
                {entry.completed ? <FaUndo></FaUndo> : <FaCheck></FaCheck>}
              </Components.Buttons.Round>
              <div
                className={
                  'todo-item-details ' +
                  (entry.completed ? 'todo-completed' : 'todo-outstanding')
                }
              >
                <p>{entry.text}</p>
                <span className="todo-created">
                  {formatDate(entry.created)}
                </span>
              </div>
              <Components.Buttons.Round
                className="todo-delete"
                onClick={() => remove({ entry, index })}
              >
                <FaTrash></FaTrash>
              </Components.Buttons.Round>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
