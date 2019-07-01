import React, { useCallback } from 'react';
import { useDocked } from 'openfin-react-hooks';
import { snapAndDock } from 'openfin-layouts';

import './Titlebar.css';

export default () => {
  const isDocked = useDocked();

  const onMinimizeClick = useCallback(async () => {
    const currentWindow = await window.fin.Window.getCurrent();
    currentWindow.minimize();
  }, []);

  const onCloseClick = useCallback(async () => {
    const currentWindow = await window.fin.Window.getCurrent();
    currentWindow.close();
  }, []);

  const onUndockClick = useCallback(async () => {
    await snapAndDock.undockWindow();
  }, []);

  return (
    <div className="titlebar-container">
      <div className="icons-container">
        <div className="button-icon minimize" onClick={onMinimizeClick} title="Minimize">&nbsp;</div>
        {isDocked[0] && <div className="button-icon undock" onClick={onUndockClick} title="Undock">&nbsp;</div>}
        <div className="button-icon close" onClick={onCloseClick} title="Close">&nbsp;</div>
      </div>
    </div>
  )
}
