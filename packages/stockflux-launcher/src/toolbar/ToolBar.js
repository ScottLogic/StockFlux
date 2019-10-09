import React, { useState } from 'react';
import Components from 'stockflux-components';
import './ToolBar.css';
import TransparentWindow from '../transparent-window/TransparentWindow';

export default ({ tools }) => {
  const [showWindow, setShowWindow] = useState(false);
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
      <TransparentWindow
        position={{ top: 200, left: 100 }}
        display={showWindow}
      >
        <button onClick={() => setShowWindow(!showWindow)}>T</button>
      </TransparentWindow>
    </div>
  );
};
