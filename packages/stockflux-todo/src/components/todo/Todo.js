import React from 'react';

const TodoItem = ({ entry, remove, index, changeStatus }) => {
  return (
    <div>
      <input
        type="button"
        value={entry.completed ? 'Done' : 'Not Done'}
        onClick={() => changeStatus({ entry, newStatus: !entry.completed })}
      ></input>
      {entry.text}
      <input
        type="button"
        value="Remove"
        onClick={() => remove({ entry, index })}
      ></input>
    </div>
  );
};

export default TodoItem;
