import React from 'react';
import Components from 'stockflux-components';
import './ToolBar.css';

export default ({ tools }) => {
  return (
    <div className="toolbar">
      {tools.map((tool, index) => (
        <Components.Buttons.Round
          key={index}
          onClick={() => tool.onClick()}
          disabled={!!tool.disabled}
          className={tool.className ? tool.className : ''}
        >
          {tool.label}
        </Components.Buttons.Round>
      ))}
    </div>
  );
};
