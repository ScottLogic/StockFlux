import React from 'react';
import './ToolBar.css';

export default ({ tools }) => {
  return (
    <div className="toolbar">
      {tools.map((tool, index) => (
        <button
          key={index}
          onClick={() => tool.onClick()}
          disabled={!!tool.disabled}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
};
