import React, { useCallback } from 'react';
import { useDocked } from 'openfin-react-hooks';
import { snapAndDock } from 'openfin-layouts';
import { OpenfinApiHelpers } from 'stockflux-core';
import CloseIcon from '../icons/close.svg';
import MinimizeIcon from '../icons/minimize.svg';

import './Titlebar.css';

export default ({ title }) => {
  const isDocked = useDocked();

  const onMinimizeClick = useCallback(async () => {
    const currentWindow = await OpenfinApiHelpers.getCurrentWindow();
    currentWindow.minimize();
  }, []);

  const onCloseClick = useCallback(async () => {
    const currentWindow = await OpenfinApiHelpers.getCurrentWindow();
    currentWindow.close();
  }, []);

  const onUndockClick = useCallback(async () => {
    await snapAndDock.undockWindow();
  }, []);

  return (
    <div className="titlebar-container">
      <div className="title-container">
        <span>{title}</span>
      </div>
      <div className="icons-container">
        <div className="header-icon" onClick={onMinimizeClick} title="Minimize">
          <MinimizeIcon />
        </div>
        {isDocked[0] && (
          <div
            className="button-icon undock"
            onClick={onUndockClick}
            title="Undock"
          >
            &nbsp;
          </div>
        )}
        <div className="header-icon" onClick={onCloseClick} title="Close">
          <CloseIcon />
        </div>
      </div>
    </div>
  );
};
